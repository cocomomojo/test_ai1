import { describe, expect, it } from "vitest";

import { categoryDefinitionSchema, tagDefinitionSchema, categoriesDefinitionSchema } from "./schema";
import { categories, tags, getCategoryBySlug, getTagByLabel } from "./categories";

describe("categoryDefinitionSchema", () => {
  it("slug・label・description で検証が通る", () => {
    const result = categoryDefinitionSchema.safeParse({
      slug: "身体を動かす",
      label: "身体を動かす",
      description: "テスト用の説明文"
    });
    expect(result.success).toBe(true);
  });

  it("slug が空文字の場合は失敗する", () => {
    const result = categoryDefinitionSchema.safeParse({
      slug: "",
      label: "ラベル",
      description: "説明"
    });
    expect(result.success).toBe(false);
  });

  it("label が空文字の場合は失敗する", () => {
    const result = categoryDefinitionSchema.safeParse({
      slug: "slug",
      label: "",
      description: "説明"
    });
    expect(result.success).toBe(false);
  });
});

describe("tagDefinitionSchema", () => {
  it("label・description で検証が通る", () => {
    const result = tagDefinitionSchema.safeParse({
      label: "運動",
      description: "テスト用タグの説明"
    });
    expect(result.success).toBe(true);
  });

  it("label が空文字の場合は失敗する", () => {
    const result = tagDefinitionSchema.safeParse({ label: "", description: "説明" });
    expect(result.success).toBe(false);
  });
});

describe("categoriesDefinitionSchema", () => {
  it("配列形式の複数カテゴリを検証できる", () => {
    const result = categoriesDefinitionSchema.safeParse([
      { slug: "a", label: "カテゴリA", description: "説明A" },
      { slug: "b", label: "カテゴリB", description: "説明B" }
    ]);
    expect(result.success).toBe(true);
  });
});

describe("categories", () => {
  it("6件のカテゴリが定義されている", () => {
    expect(categories).toHaveLength(6);
  });

  it("すべてのカテゴリが slug・label・description を持つ", () => {
    expect(categories.every((c) => c.slug && c.label && c.description)).toBe(true);
  });

  it("「身体を動かす」カテゴリが含まれる", () => {
    expect(categories.some((c) => c.slug === "身体を動かす")).toBe(true);
  });

  it("「技術を育てる」カテゴリが含まれる", () => {
    expect(categories.some((c) => c.slug === "技術を育てる")).toBe(true);
  });
});

describe("tags", () => {
  it("1件以上のタグが定義されている", () => {
    expect(tags.length).toBeGreaterThan(0);
  });

  it("すべてのタグが label・description を持つ", () => {
    expect(tags.every((t) => t.label && t.description)).toBe(true);
  });

  it("「運動」タグが含まれる", () => {
    expect(tags.some((t) => t.label === "運動")).toBe(true);
  });

  it("「DevOps」タグが含まれる", () => {
    expect(tags.some((t) => t.label === "DevOps")).toBe(true);
  });
});

describe("getCategoryBySlug", () => {
  it("存在するカテゴリ slug で CategoryDefinition を返す", () => {
    const cat = getCategoryBySlug("家で楽しむ");
    expect(cat).toBeDefined();
    expect(cat?.label).toBe("家で楽しむ");
  });

  it("存在しない slug では undefined を返す", () => {
    expect(getCategoryBySlug("存在しないカテゴリ")).toBeUndefined();
  });
});

describe("getTagByLabel", () => {
  it("存在するタグ label で TagDefinition を返す", () => {
    const tag = getTagByLabel("記録");
    expect(tag).toBeDefined();
    expect(tag?.label).toBe("記録");
  });

  it("存在しない label では undefined を返す", () => {
    expect(getTagByLabel("存在しないタグ")).toBeUndefined();
  });
});
