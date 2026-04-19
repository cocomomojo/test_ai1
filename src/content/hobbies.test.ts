import { describe, expect, it } from "vitest";

import { filterHobbies, getPublishedHobbies, hobbies } from "./hobbies";

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
});
