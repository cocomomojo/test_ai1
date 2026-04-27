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
});