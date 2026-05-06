import { expect, test } from "@playwright/test";

test("ホームが初回リリース導線を表示する", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "手を動かすテーマと技術の観察を、毎日更新できる形に整える。"
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

  await expect(page.getByRole("heading", { name: "ランニング", level: 2 })).toBeVisible();
  await expect(page.getByText("10kmを気持ちよく走れるペース作り")).toBeVisible();
  await expect(page.locator("aside").getByText("ルートメモ", { exact: true })).toBeVisible();
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

test("趣味一覧でカテゴリフィルタを使うと絞り込みできる", async ({ page }) => {
  await page.goto("/hobbies");

  await page.getByRole("button", { name: "身体を動かす" }).click();

  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "コーヒー" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();
});

test("タグフィルタ選択後に詳細ページへ遷移できる", async ({ page }) => {
  await page.goto("/hobbies");

  await page.getByRole("button", { name: "コーヒー" }).click();

  await expect(page.getByRole("heading", { name: "コーヒー" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ランニング" })).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "カレー" })).not.toBeVisible();

  await page.getByRole("link", { name: "詳細を見る" }).click();

  await expect(page.getByRole("heading", { name: "コーヒー" })).toBeVisible();
  await expect(page.getByText("朝の定番レシピを1つ完成させる")).toBeVisible();
});

test("DevOps 詳細ページが表と組み合わせ案を表示する", async ({ page }) => {
  await page.goto("/hobbies/devops");

  await expect(page.getByRole("heading", { name: "DevOps", level: 2 })).toBeVisible();
  await expect(page.getByRole("img", { name: "DevOps のイメージボード" })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByText("AI レビューから E2E 候補を起票する")).toBeVisible();
});

test("趣味詳細ページにタグと更新日が表示される", async ({ page }) => {
  await page.goto("/hobbies/running");

  await expect(page.locator("article span").filter({ hasText: /^運動$/ }).first()).toBeVisible();
  await expect(page.getByText(/更新:/)).toBeVisible();
});

test("活動ログページが表示される", async ({ page }) => {
  await page.goto("/activity");

  await expect(page.getByRole("heading", { name: "すべての活動記録" })).toBeVisible();
  await expect(page.getByRole("button", { name: "ランニング" })).toBeVisible();
});

test("活動ログページでホーム趣味フィルタを使うと絞り込みできる", async ({ page }) => {
  await page.goto("/activity");

  await page.getByRole("button", { name: "ランニング" }).click();

  await expect(page.getByRole("link", { name: "ランニング" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();
});

test("ホームの最近の活動ログから活動ログページへ遷移できる", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "すべて見る" }).click();

  await expect(page).toHaveURL("/activity");
  await expect(page.getByRole("heading", { name: "すべての活動記録" })).toBeVisible();
});

test("趣味詳細ページの活動ログ一覧リンクがフィルタ付きで遷移する", async ({ page }) => {
  await page.goto("/hobbies/running");

  await page.getByRole("link", { name: "活動ログ一覧" }).click();

  await expect(page).toHaveURL("/activity?hobby=running");
  await expect(page.getByRole("heading", { name: "すべての活動記録" })).toBeVisible();
});

test("ナビゲーションの活動ログリンクが /activity へ遷移する", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "活動ログ" }).click();

  await expect(page).toHaveURL("/activity");
});

test("趣味一覧でキーワード検索すると一致する趣味だけ表示される", async ({ page }) => {
  await page.goto("/hobbies");

  await page.getByRole("searchbox", { name: "キーワード" }).fill("ランニング");

  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "コーヒー" })).not.toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();
});

test("存在しないキーワードで検索すると0件メッセージと解除ボタンが表示される", async ({ page }) => {
  await page.goto("/hobbies?q=存在しないキーワードxyz");

  await expect(page.getByText("該当する趣味が見つかりません。")).toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();

  await page.getByRole("button", { name: "絞り込みを解除" }).click();

  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByText("該当する趣味が見つかりません。")).not.toBeVisible();
});

test("詳細ページのタグリンクをクリックすると一覧がタグで絞り込まれる", async ({ page }) => {
  await page.goto("/hobbies/running");

  await page.getByRole("link", { name: "運動" }).click();

  await expect(page).toHaveURL(/[?&]tag=%E9%81%8B%E5%8B%95/);
  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();
});

test("詳細ページのカテゴリリンクをクリックすると一覧がカテゴリで絞り込まれる", async ({ page }) => {
  await page.goto("/hobbies/running");

  await page.getByRole("link", { name: "身体を動かす" }).click();

  await expect(page).toHaveURL(/[?&]category=/);
  await expect(page.getByRole("heading", { name: "ランニング" })).toBeVisible();
  await expect(page.getByRole("button", { name: "絞り込みを解除" })).toBeVisible();
});

test("詳細ページの aside に同じカテゴリの関連趣味が表示される", async ({ page }) => {
  await page.goto("/hobbies/running");

  await expect(page.locator("aside").getByText("同じカテゴリの趣味")).toBeVisible();
});

test("詳細ページの aside にカテゴリの説明が表示される", async ({ page }) => {
  await page.goto("/hobbies/running");

  await expect(page.locator("aside").getByText("カテゴリについて")).toBeVisible();
  await expect(page.locator("aside").getByText(/ランニングなど体を動かすことを中心に/)).toBeVisible();
});