const COMPLETED_MARKER = "✅";
const COMPLETED_HEADING_KEYWORD = "完了";
const MIN_MATCH_LENGTH = 6;
const DEFAULT_DAILY_PLAN_PRIORITY = 3;
// PLAN.md Section 10 の優先順位ルールをキーワードに落とした判定テーブル。
const DAILY_PLAN_PRIORITY_KEYWORDS = {
  operations: [
    "クローズ",
    "テンプレート",
    "未定義",
    "日次",
    "issue",
    "workflow"
  ],
  quality: ["品質", "テスト", "型安全", "lint", "回帰", "検証"],
  phase2: ["phase 2", "改善サイクル", "plan-first", "dod", "task issue", "instructions", "skills"],
  phase34: ["phase 3", "phase 4", "タグ", "カテゴリ", "検索", "フィルタ", "デザイン", "機能追加"]
};
const NORMALIZED_DAILY_PLAN_PRIORITY_KEYWORDS = {
  operations: DAILY_PLAN_PRIORITY_KEYWORDS.operations.map(normalizeComparableText),
  quality: DAILY_PLAN_PRIORITY_KEYWORDS.quality.map(normalizeComparableText),
  phase2: DAILY_PLAN_PRIORITY_KEYWORDS.phase2.map(normalizeComparableText),
  phase34: DAILY_PLAN_PRIORITY_KEYWORDS.phase34.map(normalizeComparableText)
};
const DAILY_PLAN_PRIORITY_TEXT = {
  0: "運用の穴",
  1: "品質改善",
  2: "Phase 2 定着",
  [DEFAULT_DAILY_PLAN_PRIORITY]: "その他改善",
  4: "Phase 3/4 拡張"
};

/**
 * Compacts text to a single line, truncating at 240 characters.
 * @param {string} value
 * @returns {string}
 */
export function compactText(value) {
  const singleLine = value.replace(/\s+/g, " ").trim();

  if (singleLine.length <= 240) {
    return singleLine;
  }

  return `${singleLine.slice(0, 237)}...`;
}

/**
 * Extracts a compact summary from the hobbies.ts source file.
 * Only includes slug, name, category, summary, tags, and status for each hobby.
 * This avoids passing the full 85 KB hobbies.ts file to Copilot CLI.
 *
 * @param {string} fileContent - Raw content of src/content/hobbies.ts
 * @returns {string} - A concise markdown list of hobby summaries
 */
export function summarizeHobbiesContent(fileContent) {
  const lines = fileContent.split("\n");
  const hobbies = [];
  /** @type {{ slug?: string, name?: string, category?: string, summary?: string, status?: string, tags?: string[], updatedAt?: string } | null} */
  let current = null;
  let awaitingField = null;

  for (const line of lines) {
    // Top-level hobby slug: exactly 4-space indent (not nested article slugs at 8-space)
    const slugMatch = line.match(/^ {4}slug:\s+"([^"]+)"/);
    if (slugMatch) {
      current = { slug: slugMatch[1] };
      hobbies.push(current);
      awaitingField = null;
      continue;
    }

    if (!current) continue;

    // If previous line was a bare `summary:` keyword, capture the string on this line
    if (awaitingField) {
      const valueMatch = line.match(/^ {6}"([^"]+)"/);
      if (valueMatch) {
        current[awaitingField] = valueMatch[1];
      }
      awaitingField = null;
      continue;
    }

    let m;
    if ((m = line.match(/^ {4}name:\s+"([^"]+)"/))) {
      current.name = m[1];
    } else if ((m = line.match(/^ {4}category:\s+"([^"]+)"/))) {
      current.category = m[1];
    } else if ((m = line.match(/^ {4}summary:\s+"([^"]+)"/))) {
      current.summary = m[1];
    } else if (line.match(/^ {4}summary:\s*$/)) {
      // Multi-line summary: value is on the next line
      awaitingField = "summary";
    } else if ((m = line.match(/^ {4}status:\s+"([^"]+)"/))) {
      current.status = m[1];
    } else if ((m = line.match(/^ {4}updatedAt:\s+"([^"]+)"/))) {
      current.updatedAt = m[1];
    } else if ((m = line.match(/^ {4}tags:\s+\[([^\]]+)\]/))) {
      current.tags = m[1].split(",").map((t) => t.trim().replace(/^"|"$/g, ""));
    }
  }

  if (hobbies.length === 0) return "(趣味データなし)";

  return hobbies
    .map((h) =>
      [
        `- **${h.name ?? h.slug}**（${h.slug}） カテゴリ: ${h.category ?? "?"}${h.status ? ` / ${h.status}` : ""}`,
        `  ${h.summary ?? ""}`,
        h.tags?.length ? `  タグ: ${h.tags.join(", ")}` : null,
        h.updatedAt ? `  更新: ${h.updatedAt}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n");
}

/**
 * Identifies task-labeled open issues that have not been updated within the threshold period.
 * These issues may have been implemented but not yet closed.
 *
 * @param {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>} issues
 * @param {number} staleThresholdDays - Number of days without an update before an issue is considered stale (default: 14)
 * @param {Date} referenceDate - The date to compare against (default: now)
 * @returns {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>}
 */
export function classifyStaleTaskIssues(issues, staleThresholdDays = 14, referenceDate = new Date()) {
  const thresholdMs = staleThresholdDays * 24 * 60 * 60 * 1000;

  return issues.filter((issue) => {
    if (!issue.labels.includes("task")) return false;
    if (!issue.updatedAt) return false;

    const updatedAt = new Date(issue.updatedAt);
    return referenceDate.getTime() - updatedAt.getTime() > thresholdMs;
  });
}

/**
 * Formats stale task issues as a human-readable string for prompt context.
 * Returns "(なし)" if no stale issues are present.
 *
 * @param {Array<{number: number, title: string, updatedAt?: string, url: string}>} staleIssues
 * @returns {string}
 */
export function formatStaleTaskNote(staleIssues) {
  if (staleIssues.length === 0) {
    return "(なし)";
  }

  return staleIssues
    .map(
      (issue) =>
        `#${issue.number} ${issue.title} (最終更新: ${issue.updatedAt?.slice(0, 10) ?? "不明"}) ${issue.url}`
    )
    .join("\n");
}

/**
 * Filters task-labeled issues from a list of issues.
 *
 * @param {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>} issues
 * @returns {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>}
 */
export function filterTaskIssues(issues) {
  return issues.filter((issue) => issue.labels.includes("task"));
}

/**
 * Formats open task issues as a human-readable string for prompt context.
 * Used to cross-reference open tasks against README/PLAN to detect implemented-but-open issues.
 * Returns "(なし)" if no open task issues are present.
 *
 * @param {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>} taskIssues
 * @returns {string}
 */
export function formatOpenTaskIssues(taskIssues) {
  if (taskIssues.length === 0) {
    return "(なし)";
  }

  return taskIssues
    .map(
      (issue) =>
        `#${issue.number} ${issue.title} (最終更新: ${issue.updatedAt?.slice(0, 10) ?? "不明"}) ${issue.url}`
    )
    .join("\n");
}

/**
 * Generates a close comment for a task issue that has been implemented.
 *
 * @param {object} opts
 * @param {string} opts.summary - A short description of what was implemented.
 * @param {string} [opts.prUrl] - URL of the merged pull request, if available.
 * @param {string} [opts.planFirstUrl] - URL of the plan-first comment, if available.
 * @param {string[]} [opts.dodItems] - DoD checklist items verified against the assign-before comment.
 * @returns {string}
 */
export function formatTaskCloseComment({ summary, prUrl, planFirstUrl, dodItems }) {
  const lines = ["## 実装完了", "", summary];

  if (prUrl) {
    lines.push("", `実装 PR: ${prUrl}`);
  }

  if (planFirstUrl) {
    lines.push("", `Plan-First 記録: ${planFirstUrl}`);
  }

  if (dodItems && dodItems.length > 0) {
    lines.push("", "### 完了条件（DoD）確認");
    for (const item of dodItems) {
      lines.push(`- [x] ${item}`);
    }
  }

  lines.push("", "このタスクは実装が確認されたためクローズします。");

  return lines.join("\n");
}

/**
 * Extracts completed theme descriptions from README or PLAN content.
 * Looks for lines containing the ✅ completion marker and returns the
 * cleaned-up text of each line (markdown list/heading prefixes removed).
 *
 * @param {string} content - Raw content of README.md or PLAN.md
 * @returns {string[]} - Array of completed theme strings
 */
export function extractCompletedThemes(content) {
  const themes = [];
  let inCodeBlock = false;

  for (const rawLine of content.split("\n")) {
    const trimmed = rawLine.trim();

    if (trimmed.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock || !trimmed.includes(COMPLETED_MARKER)) {
      continue;
    }

    const isHeading = /^#{1,6}\s+/.test(trimmed);
    const isUnorderedList = /^[-*+]\s+/.test(trimmed);

    if (isHeading && !trimmed.includes(COMPLETED_HEADING_KEYWORD)) {
      continue;
    }

    if (!isHeading && !isUnorderedList) {
      continue;
    }

    const normalized = trimmed
      .replace(/^(?:#{1,6}|[-*+])\s+(?:\[[ xX]\]\s*)?/, "")
      .replace(new RegExp(`\\s*${COMPLETED_MARKER}\\s*`, "g"), " ")
      // Keep markdown text natural after removing the marker, e.g. "項目 ✅（補足）" -> "項目（補足）".
      .replace(/\s+([（(])/g, "$1")
      .replace(/\s+/g, " ")
      .trim();

    if (normalized) {
      themes.push(normalized);
    }
  }

  return themes;
}

/**
 * Formats completed themes as a human-readable string for prompt context.
 * Used to explicitly list already-implemented themes so the AI can avoid
 * re-proposing them as daily plan candidates.
 * Returns "(なし)" if no completed themes are found.
 *
 * @param {string[]} themes - Array of completed theme strings
 * @returns {string}
 */
export function formatCompletedThemes(themes) {
  const uniqueThemes = Array.from(
    new Set(
      themes
        .map((theme) => theme.trim())
        .filter(Boolean)
    )
  );

  if (uniqueThemes.length === 0) {
    return "(なし)";
  }

  return uniqueThemes.map((theme) => `- ${theme}`).join("\n");
}

/**
 * Filters task-labeled issues from a list of closed issues.
 * Used to prevent re-proposing recently resolved task topics in daily plans.
 *
 * @param {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>} issues
 * @returns {Array<{number: number, title: string, labels: string[], updatedAt?: string, url: string}>}
 */
export function filterClosedTaskIssues(issues) {
  return issues.filter((issue) => issue.labels.includes("task"));
}

/**
 * Formats recently closed task issues as a human-readable string for prompt context.
 * Used to prevent re-proposing topics that were recently resolved.
 * Returns "(なし)" if no recently closed task issues are present.
 *
 * @param {Array<{number: number, title: string, updatedAt?: string, url: string}>} closedTaskIssues
 * @returns {string}
 */
export function formatClosedTaskNote(closedTaskIssues) {
  if (closedTaskIssues.length === 0) {
    return "(なし)";
  }

  return closedTaskIssues
    .map(
      (issue) =>
        `#${issue.number} ${issue.title} (クローズ日: ${issue.updatedAt?.slice(0, 10) ?? "不明"}) ${issue.url}`
    )
    .join("\n");
}

/**
 * Filters non-task issues that can be proposed as daily-plan candidates.
 * Excludes themes already completed in README/PLAN and topics that overlap
 * with open/closed task issues.
 *
 * @param {Array<{number: number, title: string, body?: string, labels: string[]}>} issues
 * @param {object} context
 * @param {string[]} context.completedThemes
 * @param {Array<{title: string}>} context.openTaskIssues
 * @param {Array<{title: string}>} context.recentClosedTaskIssues
 * @returns {Array<{number: number, title: string, body?: string, labels: string[]}>}
 */
export function filterDailyPlanCandidateIssues(
  issues,
  { completedThemes = [], openTaskIssues = [], recentClosedTaskIssues = [] } = {}
) {
  const exclusionTerms = [
    ...completedThemes,
    ...openTaskIssues.map((issue) => issue.title),
    ...recentClosedTaskIssues.map((issue) => issue.title)
  ]
    .map(normalizeComparableText)
    .filter((term) => term.length >= MIN_MATCH_LENGTH);

  return issues.filter((issue) => {
    if (issue.labels.includes("task")) {
      return false;
    }

    const source = normalizeComparableText(`${issue.title} ${issue.body ?? ""}`);
    return !exclusionTerms.some((term) => includesComparable(source, term));
  });
}

/**
 * Finds open task issues that are likely already implemented by checking
 * overlap with README/PLAN completed themes.
 *
 * @param {Array<{number: number, title: string, body?: string, labels: string[], updatedAt?: string, url: string}>} openTaskIssues
 * @param {string[]} completedThemes
 * @returns {Array<{number: number, title: string, body?: string, labels: string[], updatedAt?: string, url: string}>}
 */
export function findCloseRecommendedTaskIssues(openTaskIssues, completedThemes) {
  const normalizedThemes = completedThemes
    .map(normalizeComparableText)
    .filter((term) => term.length >= MIN_MATCH_LENGTH);

  return openTaskIssues.filter((issue) => {
    const source = normalizeComparableText(`${issue.title} ${issue.body ?? ""}`);
    return normalizedThemes.some((theme) => includesComparable(source, theme));
  });
}

/**
 * Applies PLAN.md Section 10 priority rules to candidate issues.
 *
 * @param {Array<{number: number, title: string, body?: string, labels: string[], updatedAt?: string}>} candidates
 * @returns {Array<{number: number, title: string, body?: string, labels: string[], updatedAt?: string}>}
 */
export function prioritizeDailyPlanCandidateIssues(candidates) {
  return [...candidates].sort((left, right) => {
    const leftPriority = classifyDailyPlanPriority(left);
    const rightPriority = classifyDailyPlanPriority(right);

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    const leftTimestamp = parseUpdatedAtOrMax(left.updatedAt);
    const rightTimestamp = parseUpdatedAtOrMax(right.updatedAt);
    // 更新日が不明な候補は Number.MAX_SAFE_INTEGER 扱いになり比較末尾に寄る。
    if (leftTimestamp !== rightTimestamp) {
      return leftTimestamp - rightTimestamp;
    }

    return left.number - right.number;
  });
}

/**
 * Formats close-recommended task issues for the issue body section.
 * Returns "(なし)" when no issue is matched.
 *
 * @param {Array<{number: number, title: string}>} issues
 * @returns {string}
 */
export function formatCloseRecommendedTaskIssues(issues) {
  if (issues.length === 0) {
    return "(なし)";
  }

  return issues
    .map((issue) => `#${issue.number} ${issue.title} — README/PLAN の完了済みテーマと一致`)
    .join("\n");
}

/**
 * Formats sorted candidate issues for prompt context.
 * Returns "(なし)" when no candidate is available.
 *
 * @param {Array<{number: number, title: string, updatedAt?: string}>} issues
 * @returns {string}
 */
export function formatDailyPlanCandidateIssues(issues) {
  if (issues.length === 0) {
    return "(なし)";
  }

  return issues
    .map((issue) => {
      const priority = classifyDailyPlanPriority(issue);
      const priorityText =
        DAILY_PLAN_PRIORITY_TEXT[priority] ?? DAILY_PLAN_PRIORITY_TEXT[DEFAULT_DAILY_PLAN_PRIORITY];

      return `#${issue.number} ${issue.title} (優先: ${priorityText}, 更新: ${issue.updatedAt?.slice(0, 10) ?? "不明"})`;
    })
    .join("\n");
}

/**
 * Classifies a candidate issue according to PLAN.md Section 10 priority rules.
 *
 * @param {{title: string, body?: string}} issue
 * @returns {0 | 1 | 2 | 3 | 4}
 */
function classifyDailyPlanPriority(issue) {
  const normalizedSource = normalizeComparableText(`${issue.title} ${issue.body ?? ""}`);

  if (hasPriorityKeyword(normalizedSource, NORMALIZED_DAILY_PLAN_PRIORITY_KEYWORDS.operations)) {
    return 0;
  }

  if (hasPriorityKeyword(normalizedSource, NORMALIZED_DAILY_PLAN_PRIORITY_KEYWORDS.quality)) {
    return 1;
  }

  if (hasPriorityKeyword(normalizedSource, NORMALIZED_DAILY_PLAN_PRIORITY_KEYWORDS.phase2)) {
    return 2;
  }

  if (hasPriorityKeyword(normalizedSource, NORMALIZED_DAILY_PLAN_PRIORITY_KEYWORDS.phase34)) {
    return 4;
  }

  return DEFAULT_DAILY_PLAN_PRIORITY;
}

/**
 * Checks whether normalized source text includes any normalized priority keyword.
 * minimumLength=2 allows short markers such as "dod" while still avoiding noise.
 *
 * @param {string} source
 * @param {string[]} keywords
 * @returns {boolean}
 */
function hasPriorityKeyword(source, keywords) {
  return keywords.some((keyword) => includesComparable(source, keyword, 2));
}

/**
 * Performs length-gated substring matching on normalized texts.
 *
 * @param {string} source
 * @param {string} target
 * @param {number} minimumLength
 * @returns {boolean}
 */
function includesComparable(source, target, minimumLength = MIN_MATCH_LENGTH) {
  if (target.length < minimumLength) {
    return false;
  }

  return source.includes(target);
}

/**
 * Normalizes free-form text for fuzzy comparison.
 * Lowercases the text, drops non-letter/number characters, and compacts whitespace.
 *
 * @param {string} value
 * @returns {string}
 */
function normalizeComparableText(value) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses an ISO date string and returns a sortable timestamp.
 * Missing/invalid dates are mapped to Number.MAX_SAFE_INTEGER so they sort last.
 *
 * @param {string | undefined} updatedAt
 * @returns {number}
 */
function parseUpdatedAtOrMax(updatedAt) {
  const parsed = Date.parse(updatedAt ?? "");
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}
