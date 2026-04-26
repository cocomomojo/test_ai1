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
 * Generates a close comment for a task issue that has been implemented.
 *
 * @param {object} opts
 * @param {string} opts.summary - A short description of what was implemented.
 * @param {string} [opts.prUrl] - URL of the merged pull request, if available.
 * @returns {string}
 */
export function formatTaskCloseComment({ summary, prUrl }) {
  const lines = ["## 実装完了", "", summary];

  if (prUrl) {
    lines.push("", `実装 PR: ${prUrl}`);
  }

  lines.push("", "このタスクは実装が確認されたためクローズします。");

  return lines.join("\n");
}
