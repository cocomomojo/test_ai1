import { describe, expect, it } from "vitest";

import { filterHobbies, getAllActivityLogs, getArticleBySlug, getPublishedHobbies, getRecentActivityLogs, hobbies } from "./hobbies";

describe("getPublishedHobbies", () => {
  it("published が false の趣味を除外する", () => {
    const result = getPublishedHobbies();
    expect(result.every((h) => h.published !== false)).toBe(true);
  });

  it("seed データの公開済み趣味を全件返す", () => {
    const published = hobbies.filter((h) => h.published !== false);
    expect(getPublishedHobbies()).toHaveLength(published.length);
  });

  it("updatedAt の降順で並ぶ", () => {
    const result = getPublishedHobbies();
    for (let i = 1; i < result.length; i++) {
      const a = result[i - 1].updatedAt ?? "";
      const b = result[i].updatedAt ?? "";
      expect(a.localeCompare(b)).toBeGreaterThanOrEqual(0);
    }
  });

  it("updatedAt がない趣味は末尾に来る", () => {
    const withoutDate = hobbies.filter((h) => !h.updatedAt && h.published !== false);
    const result = getPublishedHobbies();
    const tail = result.slice(result.length - withoutDate.length);
    expect(tail.every((h) => !h.updatedAt)).toBe(true);
  });

  it("DIY、カレー、DevOps を公開済みテーマとして含む", () => {
    const names = getPublishedHobbies().map((h) => h.name);
    expect(names).toContain("DIY");
    expect(names).toContain("カレー");
    expect(names).toContain("DevOps");
  });

  it("すべての公開済みテーマが深掘り用データを持つ", () => {
    const result = getPublishedHobbies();
    expect(result.every((h) => h.snapshot.length >= 3)).toBe(true);
    expect(result.every((h) => h.focusTable.length >= 3)).toBe(true);
    expect(result.every((h) => h.innovationIdeas.length >= 2)).toBe(true);
    expect(result.every((h) => h.draftAngles.length >= 2)).toBe(true);
  });
});

describe("filterHobbies", () => {
  const all = getPublishedHobbies();

  it("tag を指定すると一致する趣味だけ返す", () => {
    const result = filterHobbies(all, "運動");
    expect(result.every((h) => (h.tags ?? []).includes("運動"))).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("category を指定すると一致する趣味だけ返す", () => {
    const result = filterHobbies(all, undefined, "家で楽しむ");
    expect(result.every((h) => h.category === "家で楽しむ")).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it("存在しない tag を指定すると空配列を返す", () => {
    const result = filterHobbies(all, "存在しないタグ");
    expect(result).toHaveLength(0);
  });

  it("tag も category も未指定なら全件返す", () => {
    const result = filterHobbies(all);
    expect(result).toHaveLength(all.length);
  });

  it("keyword を指定すると name が一致する趣味を返す", () => {
    const result = filterHobbies(all, undefined, undefined, "ランニング");
    expect(result.some((h) => h.slug === "running")).toBe(true);
    expect(result.every((h) => {
      const haystack = [h.name, h.summary, h.category, ...(h.tags ?? [])].join(" ").toLowerCase();
      return haystack.includes("ランニング");
    })).toBe(true);
  });

  it("keyword を小文字で指定しても大文字小文字を区別しない", () => {
    const result = filterHobbies(all, undefined, undefined, "devops");
    expect(result.some((h) => h.slug === "devops")).toBe(true);
  });

  it("存在しない keyword を指定すると空配列を返す", () => {
    const result = filterHobbies(all, undefined, undefined, "存在しないキーワードxyz");
    expect(result).toHaveLength(0);
  });

  it("keyword と category を同時に指定すると両条件の AND で絞り込む", () => {
    const running = all.find((h) => h.slug === "running");
    if (!running) throw new Error("running not found");
    const result = filterHobbies(all, undefined, running.category, "ランニング");
    expect(result.some((h) => h.slug === "running")).toBe(true);
    expect(result.every((h) => h.category === running.category)).toBe(true);
  });
});

describe("getRecentActivityLogs", () => {
  it("活動ログを日付の降順で返す", () => {
    const result = getRecentActivityLogs();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].date.localeCompare(result[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("limit を指定した件数以内で返す", () => {
    const result = getRecentActivityLogs(3);
    expect(result.length).toBeLessThanOrEqual(3);
  });

  it("hobbySlug と hobbyName が含まれる", () => {
    const result = getRecentActivityLogs(1);
    expect(result[0]).toHaveProperty("hobbySlug");
    expect(result[0]).toHaveProperty("hobbyName");
  });

  it("公開済み趣味のログだけ含む", () => {
    const publishedSlugs = getPublishedHobbies().map((h) => h.slug);
    const result = getRecentActivityLogs(100);
    expect(result.every((entry) => publishedSlugs.includes(entry.hobbySlug))).toBe(true);
  });
});

describe("getAllActivityLogs", () => {
  it("活動ログを日付の降順で返す", () => {
    const result = getAllActivityLogs();
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].date.localeCompare(result[i].date)).toBeGreaterThanOrEqual(0);
    }
  });

  it("hobbySlug・hobbyName・hobbyCategory が含まれる", () => {
    const result = getAllActivityLogs();
    if (result.length > 0) {
      expect(result[0]).toHaveProperty("hobbySlug");
      expect(result[0]).toHaveProperty("hobbyName");
      expect(result[0]).toHaveProperty("hobbyCategory");
    }
  });

  it("hobbySlug を指定すると該当する趣味のログだけ返す", () => {
    const published = getPublishedHobbies();
    const targetSlug = published.find((h) => (h.activityLog ?? []).length > 0)?.slug;
    if (!targetSlug) return;
    const result = getAllActivityLogs(targetSlug);
    expect(result.every((e) => e.hobbySlug === targetSlug)).toBe(true);
  });

  it("category を指定すると該当カテゴリのログだけ返す", () => {
    const published = getPublishedHobbies();
    const targetCategory = published.find((h) => (h.activityLog ?? []).length > 0)?.category;
    if (!targetCategory) return;
    const result = getAllActivityLogs(undefined, targetCategory);
    expect(result.every((e) => e.hobbyCategory === targetCategory)).toBe(true);
  });

  it("存在しない hobbySlug を指定すると空配列を返す", () => {
    const result = getAllActivityLogs("存在しないslug");
    expect(result).toHaveLength(0);
  });

  it("公開済み趣味のログだけ含む", () => {
    const publishedSlugs = getPublishedHobbies().map((h) => h.slug);
    const result = getAllActivityLogs();
    expect(result.every((entry) => publishedSlugs.includes(entry.hobbySlug))).toBe(true);
  });
});

describe("getArticleBySlug", () => {
  it("DIY の採寸テンプレ記事を取得できる", () => {
    const article = getArticleBySlug("diy", "half-day-diy-template");
    expect(article).toBeDefined();
    expect(article?.title).toBe("半日で終わる DIY のための採寸テンプレと3段工程カード");
    expect(article?.date).toBe("2026-04-23");
  });

  it("記事に5つのセクションが含まれる", () => {
    const article = getArticleBySlug("diy", "half-day-diy-template");
    expect(article?.sections).toHaveLength(5);
  });

  it("採寸セクションにテーブルが含まれる", () => {
    const article = getArticleBySlug("diy", "half-day-diy-template");
    const section = article?.sections.find((s) => s.heading === "採寸4項目テンプレ");
    expect(section?.table).toBeDefined();
    expect(section?.table?.headers).toContain("項目");
    expect(section?.table?.rows).toHaveLength(4);
  });

  it("存在しない趣味 slug では undefined を返す", () => {
    const article = getArticleBySlug("nonexistent", "half-day-diy-template");
    expect(article).toBeUndefined();
  });

  it("存在しない記事 slug では undefined を返す", () => {
    const article = getArticleBySlug("diy", "nonexistent-article");
    expect(article).toBeUndefined();
  });

  it("コーヒーの2系統レシピ記事を取得できる", () => {
    const article = getArticleBySlug("coffee", "morning-recipe-two-track");
    expect(article).toBeDefined();
    expect(article?.title).toBe("朝の定番レシピと気分転換レシピをどう切り分けるか");
    expect(article?.date).toBe("2026-04-26");
  });

  it("コーヒー記事に5つのセクションが含まれる", () => {
    const article = getArticleBySlug("coffee", "morning-recipe-two-track");
    expect(article?.sections).toHaveLength(5);
  });

  it("定番レシピ固定項目セクションにテーブルが含まれる", () => {
    const article = getArticleBySlug("coffee", "morning-recipe-two-track");
    const section = article?.sections.find((s) => s.heading === "定番レシピの固定項目");
    expect(section?.table).toBeDefined();
    expect(section?.table?.headers).toContain("固定項目");
    expect(section?.table?.rows).toHaveLength(3);
  });

  it("気分転換レシピセクションに2系統比較テーブルが含まれる", () => {
    const article = getArticleBySlug("coffee", "morning-recipe-two-track");
    const section = article?.sections.find((s) => s.heading === "気分転換レシピで動かす項目");
    expect(section?.table).toBeDefined();
    expect(section?.table?.headers).toContain("2系統");
    expect(section?.table?.rows).toHaveLength(2);
  });
});
