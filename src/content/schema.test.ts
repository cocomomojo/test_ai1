import { describe, expect, it } from "vitest";

import { hobbySchema, hobbiesSchema, hobbyActivityLogSchema, hobbyArticleSchema, articleTableSchema, articleSectionSchema } from "./schema";

describe("hobbyActivityLogSchema", () => {
  it("date・title・description で検証が通る", () => {
    const result = hobbyActivityLogSchema.safeParse({
      date: "2026-04-19",
      title: "テスト活動",
      description: "活動の詳細説明"
    });
    expect(result.success).toBe(true);
  });

  it("date が空文字の場合は失敗する", () => {
    const result = hobbyActivityLogSchema.safeParse({ date: "", title: "t", description: "d" });
    expect(result.success).toBe(false);
  });

  it("title が空文字の場合は失敗する", () => {
    const result = hobbyActivityLogSchema.safeParse({ date: "2026-04-19", title: "", description: "d" });
    expect(result.success).toBe(false);
  });
});

describe("hobbySchema", () => {
  const base = {
    slug: "test",
    name: "テスト",
    category: "カテゴリ",
    summary: "概要",
    detail: "詳細",
    status: "active" as const,
    cadence: "週1回",
    currentFocus: "現在の注力",
    snapshot: [
      { label: "頻度", value: "週1回", note: "note1" },
      { label: "軸", value: "3", note: "note2" },
      { label: "記録", value: "毎日", note: "note3" }
    ],
    highlights: [{ title: "h1", description: "d1" }],
    focusTable: [
      { theme: "t1", current: "c1", signal: "s1", nextAction: "n1" },
      { theme: "t2", current: "c2", signal: "s2", nextAction: "n2" },
      { theme: "t3", current: "c3", signal: "s3", nextAction: "n3" }
    ],
    innovationIdeas: [
      { title: "i1", combination: "a x b", summary: "sum1" },
      { title: "i2", combination: "c x d", summary: "sum2" }
    ],
    draftAngles: ["angle1", "angle2"],
    firstReleaseItems: ["item1", "item2"]
  };

  it("必須フィールドだけで検証が通る", () => {
    const result = hobbySchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it("tags が配列で渡せる", () => {
    const result = hobbySchema.safeParse({ ...base, tags: ["タグ1", "タグ2"] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["タグ1", "タグ2"]);
    }
  });

  it("updatedAt が文字列で渡せる", () => {
    const result = hobbySchema.safeParse({ ...base, updatedAt: "2026-04-19" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.updatedAt).toBe("2026-04-19");
    }
  });

  it("published が真偽値で渡せる", () => {
    const result = hobbySchema.safeParse({ ...base, published: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.published).toBe(false);
    }
  });

  it("snapshot、focusTable、innovationIdeas、draftAngles を持てる", () => {
    const result = hobbySchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.snapshot).toHaveLength(3);
      expect(result.data.focusTable).toHaveLength(3);
      expect(result.data.innovationIdeas).toHaveLength(2);
      expect(result.data.draftAngles).toEqual(["angle1", "angle2"]);
    }
  });

  it("status が不正な値の場合は失敗する", () => {
    const result = hobbySchema.safeParse({ ...base, status: "unknown" });
    expect(result.success).toBe(false);
  });

  it("tags に空文字を含む場合は失敗する", () => {
    const result = hobbySchema.safeParse({ ...base, tags: [""] });
    expect(result.success).toBe(false);
  });

  it("firstReleaseItems が1件の場合は失敗する", () => {
    const result = hobbySchema.safeParse({ ...base, firstReleaseItems: ["item1"] });
    expect(result.success).toBe(false);
  });

  it("draftAngles が1件の場合は失敗する", () => {
    const result = hobbySchema.safeParse({ ...base, draftAngles: ["angle1"] });
    expect(result.success).toBe(false);
  });

  it("activityLog が配列で渡せる", () => {
    const result = hobbySchema.safeParse({
      ...base,
      activityLog: [{ date: "2026-04-19", title: "タイトル", description: "説明" }]
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activityLog).toHaveLength(1);
      expect(result.data.activityLog?.[0].date).toBe("2026-04-19");
    }
  });

  it("activityLog が未指定でも検証が通る", () => {
    const result = hobbySchema.safeParse(base);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.activityLog).toBeUndefined();
    }
  });
});

describe("articleTableSchema", () => {
  it("headers と rows で検証が通る", () => {
    const result = articleTableSchema.safeParse({
      headers: ["項目", "値"],
      rows: [["行1列1", "行1列2"], ["行2列1", "行2列2"]]
    });
    expect(result.success).toBe(true);
  });

  it("headers が空の場合は失敗する", () => {
    const result = articleTableSchema.safeParse({ headers: [], rows: [] });
    expect(result.success).toBe(false);
  });
});

describe("articleSectionSchema", () => {
  it("heading と body で検証が通る", () => {
    const result = articleSectionSchema.safeParse({ heading: "見出し", body: "本文" });
    expect(result.success).toBe(true);
  });

  it("table を含む場合も検証が通る", () => {
    const result = articleSectionSchema.safeParse({
      heading: "見出し",
      body: "本文",
      table: { headers: ["列1"], rows: [["値1"]] }
    });
    expect(result.success).toBe(true);
  });
});

describe("hobbyArticleSchema", () => {
  it("slug・title・date・summary・sections で検証が通る", () => {
    const result = hobbyArticleSchema.safeParse({
      slug: "test-article",
      title: "テスト記事",
      date: "2026-04-23",
      summary: "記事の概要",
      sections: [{ heading: "はじめに", body: "本文" }]
    });
    expect(result.success).toBe(true);
  });

  it("sections が空の場合は失敗する", () => {
    const result = hobbyArticleSchema.safeParse({
      slug: "test-article",
      title: "テスト記事",
      date: "2026-04-23",
      summary: "記事の概要",
      sections: []
    });
    expect(result.success).toBe(false);
  });
});

describe("hobbySchema articles フィールド", () => {
  it("articles が配列で渡せる", () => {
    const base = {
      slug: "test",
      name: "テスト",
      category: "カテゴリ",
      summary: "概要",
      detail: "詳細",
      status: "active" as const,
      cadence: "週1回",
      currentFocus: "現在の注力",
      snapshot: [
        { label: "頻度", value: "週1回", note: "n1" },
        { label: "軸", value: "2", note: "n2" },
        { label: "記録", value: "毎日", note: "n3" }
      ],
      highlights: [{ title: "h1", description: "d1" }],
      focusTable: [
        { theme: "t1", current: "c1", signal: "s1", nextAction: "n1" },
        { theme: "t2", current: "c2", signal: "s2", nextAction: "n2" },
        { theme: "t3", current: "c3", signal: "s3", nextAction: "n3" }
      ],
      innovationIdeas: [
        { title: "i1", combination: "a x b", summary: "s1" },
        { title: "i2", combination: "c x d", summary: "s2" }
      ],
      draftAngles: ["angle1", "angle2"],
      firstReleaseItems: ["item1", "item2"]
    };

    const result = hobbySchema.safeParse({
      ...base,
      articles: [
        {
          slug: "test-article",
          title: "テスト記事",
          date: "2026-04-23",
          summary: "概要",
          sections: [
            {
              heading: "はじめに",
              body: "本文",
              table: { headers: ["列1", "列2"], rows: [["値1", "値2"]] }
            }
          ]
        }
      ]
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.articles).toHaveLength(1);
      expect(result.data.articles?.[0].slug).toBe("test-article");
    }
  });

  it("articles が未指定でも検証が通る", () => {
    const result = hobbySchema.safeParse({
      slug: "test",
      name: "テスト",
      category: "カテゴリ",
      summary: "概要",
      detail: "詳細",
      status: "active" as const,
      cadence: "週1回",
      currentFocus: "現在の注力",
      snapshot: [
        { label: "頻度", value: "週1回", note: "n1" },
        { label: "軸", value: "2", note: "n2" },
        { label: "記録", value: "毎日", note: "n3" }
      ],
      highlights: [{ title: "h1", description: "d1" }],
      focusTable: [
        { theme: "t1", current: "c1", signal: "s1", nextAction: "n1" },
        { theme: "t2", current: "c2", signal: "s2", nextAction: "n2" },
        { theme: "t3", current: "c3", signal: "s3", nextAction: "n3" }
      ],
      innovationIdeas: [
        { title: "i1", combination: "a x b", summary: "s1" },
        { title: "i2", combination: "c x d", summary: "s2" }
      ],
      draftAngles: ["angle1", "angle2"],
      firstReleaseItems: ["item1", "item2"]
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.articles).toBeUndefined();
    }
  });
});

describe("hobbiesSchema", () => {
  it("複数の趣味データを検証できる", () => {
    const data = [
      {
        slug: "a",
        name: "A",
        category: "cat",
        summary: "s",
        detail: "d",
        status: "active" as const,
        cadence: "週1回",
        currentFocus: "focus",
        snapshot: [
          { label: "頻度", value: "週1回", note: "n1" },
          { label: "軸", value: "2", note: "n2" },
          { label: "記録", value: "毎日", note: "n3" }
        ],
        highlights: [{ title: "h", description: "d" }],
        focusTable: [
          { theme: "t1", current: "c1", signal: "s1", nextAction: "n1" },
          { theme: "t2", current: "c2", signal: "s2", nextAction: "n2" },
          { theme: "t3", current: "c3", signal: "s3", nextAction: "n3" }
        ],
        innovationIdeas: [
          { title: "i1", combination: "a x b", summary: "s1" },
          { title: "i2", combination: "c x d", summary: "s2" }
        ],
        draftAngles: ["angle1", "angle2"],
        firstReleaseItems: ["i1", "i2"],
        tags: ["タグ"],
        updatedAt: "2026-04-19",
        published: true
      }
    ];
    const result = hobbiesSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

