import { describe, expect, it } from "vitest";

import { normalizeRouterBasename, resolveBasePath } from "./basePath";

describe("normalizeRouterBasename", () => {
  it("keeps the root path unchanged", () => {
    expect(normalizeRouterBasename("/")).toBe("/");
  });

  it("removes the trailing slash for project pages", () => {
    expect(normalizeRouterBasename("/test_ai1/")).toBe("/test_ai1");
  });
});

describe("resolveBasePath", () => {
  it("builds a root-based static asset path", () => {
    expect(resolveBasePath("/", "playwright-report/index.html")).toBe(
      "/playwright-report/index.html"
    );
  });

  it("builds a project pages static asset path", () => {
    expect(resolveBasePath("/test_ai1/", "playwright-report/index.html")).toBe(
      "/test_ai1/playwright-report/index.html"
    );
  });
});