import { describe, expect, it } from "vitest";

import { hobbySchema, hobbiesSchema } from "./schema";

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
