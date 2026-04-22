import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { HobbyArticlePage } from "./HobbyArticlePage";

function renderArticle(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/hobbies/:slug/articles/:articleSlug" element={<HobbyArticlePage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("HobbyArticlePage", () => {
  it("DIY の採寸テンプレ記事を表示する", () => {
    renderArticle("/hobbies/diy/articles/half-day-diy-template");

    expect(screen.getByRole("heading", { name: "半日で終わる DIY のための採寸テンプレと3段工程カード" })).toBeInTheDocument();
    expect(screen.getByText("2026-04-23")).toBeInTheDocument();
  });

  it("採寸4項目テンプレの表を表示する", () => {
    renderArticle("/hobbies/diy/articles/half-day-diy-template");

    expect(screen.getByText("採寸4項目テンプレ")).toBeInTheDocument();
    expect(screen.getByText("幅")).toBeInTheDocument();
    expect(screen.getByText("高さ")).toBeInTheDocument();
    expect(screen.getByText("奥行き")).toBeInTheDocument();
    expect(screen.getByText("余白")).toBeInTheDocument();
  });

  it("3段工程カードの表を表示する", () => {
    renderArticle("/hobbies/diy/articles/half-day-diy-template");

    expect(screen.getByText("3段工程カード")).toBeInTheDocument();
    expect(screen.getByText("作業前")).toBeInTheDocument();
    expect(screen.getByText("作業中")).toBeInTheDocument();
    expect(screen.getByText("片付け")).toBeInTheDocument();
  });

  it("工具の使用頻度と代用品の表を表示する", () => {
    renderArticle("/hobbies/diy/articles/half-day-diy-template");

    expect(screen.getByText("工具の使用頻度と代用品の見方")).toBeInTheDocument();
    expect(screen.getByText("メジャー")).toBeInTheDocument();
    expect(screen.getByText("水平器")).toBeInTheDocument();
    expect(screen.getByText("電動ドリル")).toBeInTheDocument();
  });

  it("存在しない記事では未登録メッセージを表示する", () => {
    renderArticle("/hobbies/diy/articles/nonexistent");

    expect(screen.getByText("この記事はまだ用意されていません。")).toBeInTheDocument();
  });

  it("存在しない趣味の記事では未登録メッセージを表示する", () => {
    renderArticle("/hobbies/unknown/articles/some-article");

    expect(screen.getByText("この記事はまだ用意されていません。")).toBeInTheDocument();
  });
});
