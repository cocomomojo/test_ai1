import { expect, test } from "@playwright/test";

test("ホームが初回リリース導線を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "私の趣味を、続けやすい形で少しずつ残していく。"
    })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "趣味一覧を見る" })).toBeVisible();
});

test("趣味一覧が主要テーマを表示する", async ({ page }) => {
  await page.goto("/hobbies");

  await expect(page.getByRole("heading", { name: "今このサイトで扱うテーマ" })).toBeVisible();
  await expect(page.getByRole("link", { name: "詳細を見る" }).first()).toBeVisible();
});

test("趣味詳細がランニングの内容を表示する", async ({ page }) => {
  await page.goto("/hobbies/running");

  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByText("10kmを気持ちよく走れるペース作り")).toBeVisible();
  await expect(page.getByText("ルートメモ")).toBeVisible();
});

test("フッターの E2E テストレポートリンクが /report へ遷移する", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "E2E テストレポート" }).click();

  await expect(page).toHaveURL("/report");
  await expect(page.getByRole("heading", { name: "E2E テストレポート" })).toBeVisible();
});

test("テストレポートページが最新レポートへのリンクを持つ", async ({ page }) => {
  await page.goto("/report");

  await expect(page.getByRole("heading", { name: "E2E テストレポート" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "最新のテストレポートを開く" })
  ).toHaveAttribute("href", "/playwright-report/index.html");
});