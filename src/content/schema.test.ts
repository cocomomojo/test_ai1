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
    highlights: [{ title: "h1", description: "d1" }],
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
        highlights: [{ title: "h", description: "d" }],
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
