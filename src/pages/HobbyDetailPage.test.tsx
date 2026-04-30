import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { HobbyDetailPage } from "./HobbyDetailPage";

function renderDetail(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/hobbies/:slug" element={<HobbyDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HobbyDetailPage", () => {
  it("DevOps の詳細でビジュアル、表、組み合わせ案を表示する", () => {
    renderDetail("/hobbies/devops");

    expect(screen.getAllByRole("heading", { name: "DevOps" }).length).toBeGreaterThan(0);
    expect(screen.getByRole("img", { name: "DevOps のイメージボード" })).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("AI レビューから E2E 候補を起票する")).toBeInTheDocument();
    expect(screen.getByText("CI/CD と AI を組み合わせる時に自動化しすぎない境界")).toBeInTheDocument();
  });

  it("存在しない slug の場合は未登録メッセージを表示する", () => {
    renderDetail("/hobbies/unknown");

    expect(screen.getByText("この趣味ページはまだ用意されていません。")).toBeInTheDocument();
  });

  it("running の詳細で活動ログが表示される", () => {
    renderDetail("/hobbies/running");

    expect(screen.getByText("活動ログ")).toBeInTheDocument();
    expect(screen.getByText("10kmビルドアップ走を試した")).toBeInTheDocument();
  });

  it("活動ログのない趣味では活動ログセクションが表示されない", () => {
    renderDetail("/hobbies/curry");

    expect(screen.queryByText("活動ログ")).not.toBeInTheDocument();
  });

  it("タグがリンクとして表示され /hobbies?tag= へ遷移できる", () => {
    renderDetail("/hobbies/running");

    const tagLink = screen.getByRole("link", { name: "運動" });
    expect(tagLink).toBeInTheDocument();
    expect(tagLink.getAttribute("href")).toContain("tag=");
    expect(tagLink.getAttribute("href")).toContain("/hobbies");
  });

  it("カテゴリがリンクとして表示され /hobbies?category= へ遷移できる", () => {
    renderDetail("/hobbies/running");

    const catLink = screen.getByRole("link", { name: "身体を動かす" });
    expect(catLink).toBeInTheDocument();
    expect(catLink.getAttribute("href")).toContain("category=");
    expect(catLink.getAttribute("href")).toContain("/hobbies");
  });

  it("同じカテゴリの趣味が存在しない場合は関連趣味セクションが表示されない", () => {
    // 現在の seed データでは「身体を動かす」カテゴリには running 1件のみ
    renderDetail("/hobbies/running");

    expect(screen.queryByText("同じカテゴリの趣味")).not.toBeInTheDocument();
  });

  it("DevOps の詳細でも関連趣味セクションが表示されない（カテゴリ1件）", () => {
    // 現在の seed データでは「技術を育てる」カテゴリには devops 1件のみ
    renderDetail("/hobbies/devops");

    expect(screen.queryByText("同じカテゴリの趣味")).not.toBeInTheDocument();
  });
});