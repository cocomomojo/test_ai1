import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { classifyStaleTaskIssues, compactText, formatStaleTaskNote } from "./issue-utils.mjs";

const repository = process.env.REPOSITORY ?? process.env.GITHUB_REPOSITORY;

if (!repository) {
  throw new Error("REPOSITORY or GITHUB_REPOSITORY is required.");
}

const planDate = resolvePlanDate(process.env.PLAN_DATE);
const dryRun = toBoolean(process.env.DRY_RUN);
const request = process.env.REQUEST?.trim() || null;
const title = `日次プラン提案 ${planDate}`;

const openIssues = listIssues("open", 20);
const recentClosedIssues = listIssues("closed", 10);
const staleTaskIssues = classifyStaleTaskIssues(openIssues);
const existingIssue = openIssues.find((issue) => issue.title === title);

if (existingIssue) {
  console.log(`Skipped: ${existingIssue.url}`);
  process.exit(0);
}

const prompt = buildPrompt({
  repository,
  planDate,
  openIssues,
  recentClosedIssues,
  staleTaskIssues,
  request
});

const generatedBody = normalizeGeneratedBody(generateIssueBody(prompt));
const issueBody = [
  "## 自動生成メモ",
  `- 実行日: ${planDate}`,
  "- 生成元: GitHub Actions / Daily Plan Issue",
  "- 注意: 自動提案なので、採用前に内容を確認してください。",
  "",
  generatedBody
].join("\n");

if (dryRun) {
  console.log(title);
  console.log("");
  console.log(issueBody);
  process.exit(0);
}

const tempDir = mkdtempSync(path.join(tmpdir(), "daily-plan-issue-"));
const bodyPath = path.join(tempDir, "issue-body.md");

try {
  writeFileSync(bodyPath, issueBody, "utf8");
  const issueUrl = runCommand("gh", [
    "issue",
    "create",
    "--repo",
    repository,
    "--title",
    title,
    "--body-file",
    bodyPath,
    "--label",
    "plan-first"
  ]);

  console.log(`Created: ${issueUrl}`);
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}

function buildPrompt({ repository: currentRepository, planDate: currentPlanDate, openIssues: currentOpenIssues, recentClosedIssues: currentClosedIssues, staleTaskIssues: currentStaleTaskIssues, request: currentRequest }) {
  const promptTemplate = readWorkspaceFile(".github/prompts/daily-plan-issue.prompt.md");

  const requestSection = currentRequest
    ? `\n今日の要望:\n${currentRequest}`
    : "";

  return promptTemplate
    .replaceAll("{{PLAN_DATE}}", currentPlanDate)
    .replaceAll("{{REPOSITORY}}", currentRepository)
    .replaceAll("{{README_CONTENT}}", readWorkspaceFile("README.md"))
    .replaceAll("{{PLAN_CONTENT}}", readWorkspaceFile("PLAN.md"))
    .replaceAll("{{COPILOT_INSTRUCTIONS}}", readWorkspaceFile(".github/copilot-instructions.md"))
    .replaceAll("{{OPEN_ISSUES}}", JSON.stringify(currentOpenIssues, null, 2))
    .replaceAll("{{RECENT_CLOSED_ISSUES}}", JSON.stringify(currentClosedIssues, null, 2))
    .replaceAll("{{STALE_TASK_ISSUES}}", formatStaleTaskNote(currentStaleTaskIssues))
    .replaceAll("{{REQUEST}}", requestSection);
}

function generateIssueBody(prompt) {
  if (process.env.MOCK_COPILOT_RESPONSE) {
    return process.env.MOCK_COPILOT_RESPONSE;
  }

  if (!process.env.COPILOT_GITHUB_TOKEN) {
    throw new Error(
      "COPILOT_GITHUB_TOKEN is required. Add the COPILOT_CLI_TOKEN repository secret with the Copilot Requests permission."
    );
  }

  const argumentsList = [
    "-p",
    prompt,
    "--silent",
    "--no-ask-user",
    "--allow-all-tools",
    "--disable-builtin-mcps",
    "--deny-tool=shell",
    "--deny-tool=write",
    "--no-custom-instructions"
  ];

  const model = process.env.COPILOT_MODEL?.trim();

  if (model) {
    argumentsList.push("--model", model);
  }

  return runCommand("copilot", argumentsList, {
    env: {
      ...process.env,
      COPILOT_GITHUB_TOKEN: process.env.COPILOT_GITHUB_TOKEN
    }
  });
}

function listIssues(state, limit) {
  const raw = runCommand("gh", [
    "issue",
    "list",
    "--repo",
    repository,
    "--state",
    state,
    "--limit",
    String(limit),
    "--json",
    "number,title,body,labels,url,updatedAt"
  ]);

  return JSON.parse(raw).map((issue) => ({
    number: issue.number,
    title: issue.title,
    body: compactText(issue.body),
    labels: issue.labels.map((label) => label.name),
    url: issue.url,
    updatedAt: issue.updatedAt
  }));
}

function runCommand(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trim();
}

function readWorkspaceFile(relativePath) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8").trim();
}

function resolvePlanDate(value) {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

function normalizeGeneratedBody(value) {
  const trimmed = value.trim();
  const withoutFence = trimmed
    .replace(/^```(?:markdown)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  if (!withoutFence) {
    throw new Error("Copilot CLI returned an empty issue body.");
  }

  return withoutFence;
}

function toBoolean(value) {
  return /^(1|true|yes)$/i.test(value ?? "");
}