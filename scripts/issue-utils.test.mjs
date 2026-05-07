import { describe, expect, it } from "vitest";

import { classifyStaleTaskIssues, compactText, extractCompletedThemes, filterClosedTaskIssues, filterTaskIssues, formatClosedTaskNote, formatCompletedThemes, formatOpenTaskIssues, formatStaleTaskNote, formatTaskCloseComment, summarizeHobbiesContent } from "./issue-utils.mjs";

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

describe("formatTaskCloseComment", () => {
  it("summary だけで正しい本文を返す", () => {
    const result = formatTaskCloseComment({ summary: "GitHub Pages の公開フローを追加した。" });
    expect(result).toContain("## 実装完了");
    expect(result).toContain("GitHub Pages の公開フローを追加した。");
    expect(result).toContain("このタスクは実装が確認されたためクローズします。");
  });

  it("prUrl が指定された場合に URL を含む", () => {
    const result = formatTaskCloseComment({
      summary: "デプロイ処理を実装した。",
      prUrl: "https://github.com/example/repo/pull/42"
    });
    expect(result).toContain("実装 PR: https://github.com/example/repo/pull/42");
  });

  it("prUrl が未指定の場合は PR 行を含まない", () => {
    const result = formatTaskCloseComment({ summary: "実装完了。" });
    expect(result).not.toContain("実装 PR:");
  });

  it("planFirstUrl が指定された場合に Plan-First 記録行を含む", () => {
    const result = formatTaskCloseComment({
      summary: "実装完了。",
      planFirstUrl: "https://github.com/example/repo/issues/5#issuecomment-123"
    });
    expect(result).toContain("Plan-First 記録: https://github.com/example/repo/issues/5#issuecomment-123");
  });

  it("planFirstUrl が未指定の場合は Plan-First 記録行を含まない", () => {
    const result = formatTaskCloseComment({ summary: "実装完了。" });
    expect(result).not.toContain("Plan-First 記録:");
  });

  it("dodItems が指定された場合に DoD チェックリストを含む", () => {
    const result = formatTaskCloseComment({
      summary: "実装完了。",
      dodItems: ["実装が完了している", "単体テストが通る"]
    });
    expect(result).toContain("### 完了条件（DoD）確認");
    expect(result).toContain("- [x] 実装が完了している");
    expect(result).toContain("- [x] 単体テストが通る");
  });

  it("dodItems が空配列の場合は DoD セクションを含まない", () => {
    const result = formatTaskCloseComment({ summary: "実装完了。", dodItems: [] });
    expect(result).not.toContain("### 完了条件（DoD）確認");
  });

  it("dodItems が未指定の場合は DoD セクションを含まない", () => {
    const result = formatTaskCloseComment({ summary: "実装完了。" });
    expect(result).not.toContain("### 完了条件（DoD）確認");
  });
});

describe("filterTaskIssues", () => {
  const makeIssue = (overrides = {}) => ({
    number: 1,
    title: "テスト issue",
    labels: ["task"],
    updatedAt: "2026-04-01T00:00:00Z",
    url: "https://github.com/example/repo/issues/1",
    ...overrides
  });

  it("task ラベルを持つ issue だけを返す", () => {
    const issues = [
      makeIssue({ number: 1, labels: ["task"] }),
      makeIssue({ number: 2, labels: ["goal"] }),
      makeIssue({ number: 3, labels: ["task", "plan-first"] })
    ];
    const result = filterTaskIssues(issues);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.number)).toEqual([1, 3]);
  });

  it("task ラベルがない issue はすべて除外する", () => {
    const issues = [
      makeIssue({ labels: ["goal"] }),
      makeIssue({ labels: ["plan-first"] }),
      makeIssue({ labels: ["knowledge"] })
    ];
    expect(filterTaskIssues(issues)).toHaveLength(0);
  });

  it("空の issue 一覧では空配列を返す", () => {
    expect(filterTaskIssues([])).toHaveLength(0);
  });

  it("すべてが task ラベルを持つ場合はすべて返す", () => {
    const issues = [
      makeIssue({ number: 1 }),
      makeIssue({ number: 2 }),
      makeIssue({ number: 3 })
    ];
    expect(filterTaskIssues(issues)).toHaveLength(3);
  });
});

describe("formatOpenTaskIssues", () => {
  it("task issue がなければ '(なし)' を返す", () => {
    expect(formatOpenTaskIssues([])).toBe("(なし)");
  });

  it("issue 番号・タイトル・最終更新日・URL を含む文字列を返す", () => {
    const issue = {
      number: 6,
      title: "GitHub Pages 向けの公開フローを追加",
      updatedAt: "2026-04-18T13:15:03Z",
      url: "https://github.com/cocomomojo/test_ai1/issues/6"
    };
    const result = formatOpenTaskIssues([issue]);
    expect(result).toContain("#6");
    expect(result).toContain("GitHub Pages 向けの公開フローを追加");
    expect(result).toContain("2026-04-18");
    expect(result).toContain("https://github.com/cocomomojo/test_ai1/issues/6");
  });

  it("複数の issue を改行で区切る", () => {
    const issues = [
      { number: 5, title: "Issue A", updatedAt: "2026-04-10T00:00:00Z", url: "https://github.com/r/i/5" },
      { number: 6, title: "Issue B", updatedAt: "2026-04-18T00:00:00Z", url: "https://github.com/r/i/6" }
    ];
    const result = formatOpenTaskIssues(issues);
    const lines = result.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("#5");
    expect(lines[1]).toContain("#6");
  });

  it("updatedAt が undefined の場合は '不明' と表示する", () => {
    const issue = { number: 3, title: "Issue C", updatedAt: undefined, url: "https://github.com/r/i/3" };
    const result = formatOpenTaskIssues([issue]);
    expect(result).toContain("不明");
  });
});

describe("filterClosedTaskIssues", () => {
  const makeIssue = (overrides = {}) => ({
    number: 1,
    title: "テスト issue",
    labels: ["task"],
    updatedAt: "2026-04-20T00:00:00Z",
    url: "https://github.com/example/repo/issues/1",
    ...overrides
  });

  it("task ラベルを持つ issue だけを返す", () => {
    const issues = [
      makeIssue({ number: 1, labels: ["task"] }),
      makeIssue({ number: 2, labels: ["goal"] }),
      makeIssue({ number: 3, labels: ["task", "plan-first"] })
    ];
    const result = filterClosedTaskIssues(issues);
    expect(result).toHaveLength(2);
    expect(result.map((i) => i.number)).toEqual([1, 3]);
  });

  it("task ラベルがない issue はすべて除外する", () => {
    const issues = [makeIssue({ labels: ["goal"] }), makeIssue({ labels: ["knowledge"] })];
    expect(filterClosedTaskIssues(issues)).toHaveLength(0);
  });

  it("空の issue 一覧では空配列を返す", () => {
    expect(filterClosedTaskIssues([])).toHaveLength(0);
  });
});

describe("formatClosedTaskNote", () => {
  it("クローズ済み task issue がなければ '(なし)' を返す", () => {
    expect(formatClosedTaskNote([])).toBe("(なし)");
  });

  it("issue 番号・タイトル・クローズ日・URL を含む文字列を返す", () => {
    const issue = {
      number: 7,
      title: "GitHub Pages 公開フロー整備",
      updatedAt: "2026-04-25T10:00:00Z",
      url: "https://github.com/cocomomojo/test_ai1/issues/7"
    };
    const result = formatClosedTaskNote([issue]);
    expect(result).toContain("#7");
    expect(result).toContain("GitHub Pages 公開フロー整備");
    expect(result).toContain("2026-04-25");
    expect(result).toContain("https://github.com/cocomomojo/test_ai1/issues/7");
    expect(result).toContain("クローズ日:");
  });

  it("複数の issue を改行で区切る", () => {
    const issues = [
      { number: 8, title: "Issue A", updatedAt: "2026-04-20T00:00:00Z", url: "https://github.com/r/i/8" },
      { number: 9, title: "Issue B", updatedAt: "2026-04-22T00:00:00Z", url: "https://github.com/r/i/9" }
    ];
    const result = formatClosedTaskNote(issues);
    const lines = result.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("#8");
    expect(lines[1]).toContain("#9");
  });

  it("updatedAt が undefined の場合は '不明' と表示する", () => {
    const issue = { number: 10, title: "Issue D", updatedAt: undefined, url: "https://github.com/r/i/10" };
    const result = formatClosedTaskNote([issue]);
    expect(result).toContain("不明");
  });
});

const MINIMAL_PLAN_MD = `
## 7. 実行フェーズ

### Phase 0: 開発基盤の整備 — 完了 ✅

- React + TypeScript + Vite の初期構成を作る
- lint / format / test の基本設定を入れる

### Phase 1: Plan C ベースの最小公開版を作る — 完了 ✅

### Phase 3: コンテンツと体験を拡張する

- タグやカテゴリを導入する ✅
- 更新履歴や活動ログを追加する ✅
- 検索やフィルタを必要に応じて追加する ✅
- デザインを磨いて世界観を明確にする
`;

describe("extractCompletedThemes", () => {
  it("✅ マーク付きの行だけを返す", () => {
    const result = extractCompletedThemes(MINIMAL_PLAN_MD);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((theme) => expect(theme).not.toContain("✅"));
  });

  it("✅ のない行は除外する", () => {
    const result = extractCompletedThemes(MINIMAL_PLAN_MD);
    expect(result).not.toContain("デザインを磨いて世界観を明確にする");
    expect(result).not.toContain("React + TypeScript + Vite の初期構成を作る");
  });

  it("リスト項目の ✅ を正しく抽出する", () => {
    const result = extractCompletedThemes(MINIMAL_PLAN_MD);
    expect(result).toContain("タグやカテゴリを導入する");
    expect(result).toContain("更新履歴や活動ログを追加する");
    expect(result).toContain("検索やフィルタを必要に応じて追加する");
  });

  it("見出し行の ✅ も抽出する", () => {
    const result = extractCompletedThemes(MINIMAL_PLAN_MD);
    expect(result.some((t) => t.includes("Phase 0"))).toBe(true);
    expect(result.some((t) => t.includes("Phase 1"))).toBe(true);
  });

  it("抽出結果に ✅ 文字を含まない", () => {
    const result = extractCompletedThemes(MINIMAL_PLAN_MD);
    result.forEach((theme) => expect(theme).not.toContain("✅"));
  });

  it("空文字列を渡すと空配列を返す", () => {
    expect(extractCompletedThemes("")).toHaveLength(0);
  });

  it("✅ が一切ない内容では空配列を返す", () => {
    const content = "# タイトル\n- 未実装の項目\n- もう一つ未実装";
    expect(extractCompletedThemes(content)).toHaveLength(0);
  });

  it("結果に空文字列を含まない", () => {
    const content = "✅\n- 完了テーマ ✅";
    const result = extractCompletedThemes(content);
    result.forEach((theme) => expect(theme.length).toBeGreaterThan(0));
  });
});

describe("formatCompletedThemes", () => {
  it("完了済みテーマがなければ '(なし)' を返す", () => {
    expect(formatCompletedThemes([])).toBe("(なし)");
  });

  it("各テーマを '- ' プレフィックス付きのリスト形式で返す", () => {
    const result = formatCompletedThemes(["タグやカテゴリを導入する", "検索やフィルタを追加する"]);
    expect(result).toContain("- タグやカテゴリを導入する");
    expect(result).toContain("- 検索やフィルタを追加する");
  });

  it("複数テーマを改行で区切る", () => {
    const themes = ["テーマ A", "テーマ B", "テーマ C"];
    const result = formatCompletedThemes(themes);
    const lines = result.split("\n");
    expect(lines).toHaveLength(3);
    expect(lines[0]).toBe("- テーマ A");
    expect(lines[1]).toBe("- テーマ B");
    expect(lines[2]).toBe("- テーマ C");
  });

  it("1件だけでも正しく返す", () => {
    expect(formatCompletedThemes(["唯一のテーマ"])).toBe("- 唯一のテーマ");
  });
});

const MINIMAL_HOBBIES_TS = `
import type { Hobby } from "./schema";

const hobbySeed = [
  {
    slug: "running",
    name: "ランニング",
    category: "身体を動かす",
    summary: "走った記録を残しながら、無理なく続けるための工夫をまとめる。",
    status: "active",
    cadence: "週3回",
    tags: ["運動", "健康", "記録"],
    updatedAt: "2026-04-20",
    published: true,
    highlights: []
  },
  {
    slug: "devops",
    name: "DevOps",
    category: "技術を育てる",
    summary:
      "CI/CD、AWS、E2E、AI の動向を自分の運用に引き寄せて整理し、新しい組み合わせの仮説を考える。",
    status: "active",
    cadence: "毎週",
    tags: ["DevOps", "CI/CD", "AWS"],
    updatedAt: "2026-04-22",
    published: true,
    highlights: []
  }
];
`;

describe("summarizeHobbiesContent", () => {
  it("各趣味の名前・slug・カテゴリを含む文字列を返す", () => {
    const result = summarizeHobbiesContent(MINIMAL_HOBBIES_TS);
    expect(result).toContain("ランニング");
    expect(result).toContain("running");
    expect(result).toContain("身体を動かす");
    expect(result).toContain("DevOps");
    expect(result).toContain("技術を育てる");
  });

  it("summary（単行）が含まれる", () => {
    const result = summarizeHobbiesContent(MINIMAL_HOBBIES_TS);
    expect(result).toContain("走った記録を残しながら");
  });

  it("summary（複数行形式）が含まれる", () => {
    const result = summarizeHobbiesContent(MINIMAL_HOBBIES_TS);
    expect(result).toContain("CI/CD、AWS、E2E、AI");
  });

  it("タグが含まれる", () => {
    const result = summarizeHobbiesContent(MINIMAL_HOBBIES_TS);
    expect(result).toContain("運動");
    expect(result).toContain("健康");
    expect(result).toContain("記録");
  });

  it("元の hobbies.ts より大幅に短い文字列を返す", () => {
    // 多くのフィールドを含む大きな入力を作り、出力が大幅に短くなることを検証する
    const bigContent = `
const hobbySeed = [
  {
    slug: "running",
    name: "ランニング",
    category: "身体を動かす",
    summary: "要約文。",
    status: "active",
    cadence: "週3回",
    tags: ["運動", "健康"],
    updatedAt: "2026-04-20",
    published: true,
    detail: "${"詳細文章。".repeat(100)}",
    highlights: [
      { title: "ハイライト1", description: "${"説明".repeat(50)}" },
      { title: "ハイライト2", description: "${"説明".repeat(50)}" }
    ],
    focusTable: [
      { theme: "A", current: "${"現状".repeat(50)}", signal: "${"気づき".repeat(50)}", nextAction: "${"次".repeat(50)}" }
    ],
    draftAngles: ["${"角度".repeat(50)}", "${"角度".repeat(50)}"],
    firstReleaseItems: ["${"アイテム".repeat(50)}"],
    innovationIdeas: [
      { title: "AI アイデア", combination: "A x B", summary: "${"まとめ".repeat(50)}" }
    ]
  }
];`;
    const result = summarizeHobbiesContent(bigContent);
    expect(result.length).toBeLessThan(bigContent.length / 5);
  });

  it("空文字列を渡すと '(趣味データなし)' を返す", () => {
    expect(summarizeHobbiesContent("")).toBe("(趣味データなし)");
  });

  it("ネストされた articles slug を hobby として誤検出しない", () => {
    const contentWithArticle = `
const hobbySeed = [
  {
    slug: "running",
    name: "ランニング",
    category: "身体を動かす",
    summary: "まとめる。",
    tags: ["運動"],
    articles: [
      {
        slug: "article-slug",
        title: "記事タイトル"
      }
    ]
  }
];
`;
    const result = summarizeHobbiesContent(contentWithArticle);
    // ランニングは含まれる
    expect(result).toContain("ランニング");
    // article-slug は独立した趣味として含まれない（名前 "ランニング" を持たない余分なエントリが出ない）
    const lines = result.split("\n").filter((l) => l.startsWith("- **"));
    expect(lines).toHaveLength(1);
  });
});
