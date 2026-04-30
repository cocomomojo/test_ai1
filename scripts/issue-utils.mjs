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
