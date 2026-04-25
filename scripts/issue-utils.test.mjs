import { describe, expect, it } from "vitest";

import { classifyStaleTaskIssues, compactText, formatStaleTaskNote } from "./issue-utils.mjs";

describe("compactText", () => {
  it("240文字以下のテキストはそのまま返す", () => {
    const input = "短いテキスト";
    expect(compactText(input)).toBe("短いテキスト");
  });

  it("241文字以上のテキストは237文字で切り捨てて ... を付ける", () => {
    const input = "a".repeat(300);
    const result = compactText(input);
    expect(result).toHaveLength(240);
    expect(result.endsWith("...")).toBe(true);
  });

  it("ちょうど240文字のテキストは切り捨てしない", () => {
    const input = "a".repeat(240);
    expect(compactText(input)).toBe(input);
  });

  it("複数の空白・改行をスペース1つに正規化する", () => {
    const input = "Hello\n  World\t\t!";
    expect(compactText(input)).toBe("Hello World !");
  });

  it("先頭・末尾の空白をトリムする", () => {
    expect(compactText("  hello  ")).toBe("hello");
  });
});

describe("classifyStaleTaskIssues", () => {
  const referenceDate = new Date("2026-04-26T00:00:00Z");

  const makeIssue = (overrides = {}) => ({
    number: 1,
    title: "テスト issue",
    labels: ["task"],
    updatedAt: "2026-04-01T00:00:00Z",
    url: "https://github.com/example/repo/issues/1",
    ...overrides
  });

  it("task ラベルを持ち、threshold を超えて未更新の issue を返す", () => {
    const issue = makeIssue({ updatedAt: "2026-04-01T00:00:00Z" });
    const result = classifyStaleTaskIssues([issue], 14, referenceDate);
    expect(result).toHaveLength(1);
    expect(result[0].number).toBe(1);
  });

  it("task ラベルがない issue は除外する", () => {
    const issue = makeIssue({ labels: ["goal"], updatedAt: "2026-04-01T00:00:00Z" });
    const result = classifyStaleTaskIssues([issue], 14, referenceDate);
    expect(result).toHaveLength(0);
  });

  it("threshold 以内に更新された task は除外する", () => {
    const issue = makeIssue({ updatedAt: "2026-04-20T00:00:00Z" });
    const result = classifyStaleTaskIssues([issue], 14, referenceDate);
    expect(result).toHaveLength(0);
  });

  it("updatedAt がない issue は除外する", () => {
    const issue = makeIssue({ updatedAt: undefined });
    const result = classifyStaleTaskIssues([issue], 14, referenceDate);
    expect(result).toHaveLength(0);
  });

  it("threshold をゼロにするとすべての task issue を返す", () => {
    const issues = [
      makeIssue({ number: 1, updatedAt: "2026-04-25T00:00:00Z" }),
      makeIssue({ number: 2, updatedAt: "2026-04-25T00:00:00Z" })
    ];
    const result = classifyStaleTaskIssues(issues, 0, referenceDate);
    expect(result).toHaveLength(2);
  });

  it("空の issue 一覧では空配列を返す", () => {
    expect(classifyStaleTaskIssues([], 14, referenceDate)).toHaveLength(0);
  });

  it("task ラベルが複数あっても正しく判定する", () => {
    const issue = makeIssue({ labels: ["task", "plan-first"], updatedAt: "2026-04-01T00:00:00Z" });
    const result = classifyStaleTaskIssues([issue], 14, referenceDate);
    expect(result).toHaveLength(1);
  });
});

describe("formatStaleTaskNote", () => {
  it("stale issue がなければ '(なし)' を返す", () => {
    expect(formatStaleTaskNote([])).toBe("(なし)");
  });

  it("issue 番号・タイトル・最終更新日・URL を含む文字列を返す", () => {
    const issue = {
      number: 6,
      title: "GitHub Pages 向けの公開フローを追加",
      updatedAt: "2026-04-01T12:00:00Z",
      url: "https://github.com/example/repo/issues/6"
    };
    const result = formatStaleTaskNote([issue]);
    expect(result).toContain("#6");
    expect(result).toContain("GitHub Pages 向けの公開フローを追加");
    expect(result).toContain("2026-04-01");
    expect(result).toContain("https://github.com/example/repo/issues/6");
  });

  it("複数の issue を改行で区切る", () => {
    const issues = [
      { number: 1, title: "Issue A", updatedAt: "2026-04-01T00:00:00Z", url: "https://github.com/r/i/1" },
      { number: 2, title: "Issue B", updatedAt: "2026-04-02T00:00:00Z", url: "https://github.com/r/i/2" }
    ];
    const result = formatStaleTaskNote(issues);
    const lines = result.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("#1");
    expect(lines[1]).toContain("#2");
  });

  it("updatedAt が undefined の場合は '不明' と表示する", () => {
    const issue = { number: 3, title: "Issue C", updatedAt: undefined, url: "https://github.com/r/i/3" };
    const result = formatStaleTaskNote([issue]);
    expect(result).toContain("不明");
  });
});
