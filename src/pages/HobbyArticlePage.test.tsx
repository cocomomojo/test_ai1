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

  it("コーヒーの2系統レシピ記事を表示する", () => {
    renderArticle("/hobbies/coffee/articles/morning-recipe-two-track");

    expect(screen.getByRole("heading", { name: "朝の定番レシピと気分転換レシピをどう切り分けるか" })).toBeInTheDocument();
    expect(screen.getByText("2026-04-26")).toBeInTheDocument();
  });

  it("定番レシピ固定項目の表を表示する", () => {
    renderArticle("/hobbies/coffee/articles/morning-recipe-two-track");

    expect(screen.getByText("定番レシピの固定項目")).toBeInTheDocument();
    expect(screen.getAllByText("湯量").length).toBeGreaterThan(0);
    expect(screen.getAllByText("抽出時間").length).toBeGreaterThan(0);
    expect(screen.getAllByText("挽き目").length).toBeGreaterThan(0);
  });

  it("2系統比較表を表示する", () => {
    renderArticle("/hobbies/coffee/articles/morning-recipe-two-track");

    expect(screen.getByText("気分転換レシピで動かす項目")).toBeInTheDocument();
    expect(screen.getByText("定番レシピ")).toBeInTheDocument();
    expect(screen.getByText("気分転換レシピ")).toBeInTheDocument();
  });

  it("豆の短評と道具メモの表を表示する", () => {
    renderArticle("/hobbies/coffee/articles/morning-recipe-two-track");

    expect(screen.getByText("豆の短評3軸と道具メモの残し方")).toBeInTheDocument();
    expect(screen.getByText("香り")).toBeInTheDocument();
    expect(screen.getByText("甘さ")).toBeInTheDocument();
    expect(screen.getByText("後味")).toBeInTheDocument();
  });
});
