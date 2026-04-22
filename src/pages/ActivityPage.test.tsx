import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { ActivityPage } from "./ActivityPage";

function renderPage(search = "") {
  render(
    <MemoryRouter initialEntries={[`/activity${search}`]}>
      <ActivityPage />
    </MemoryRouter>
  );
}

describe("ActivityPage", () => {
  it("ページ見出しを表示する", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "すべての活動記録" })).toBeInTheDocument();
  });

  it("公開済み趣味のフィルタボタンが表示される", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "コーヒー" })).toBeInTheDocument();
  });

  it("カテゴリフィルタボタンが表示される", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "身体を動かす" })).toBeInTheDocument();
  });

  it("活動ログが表示される", () => {
    renderPage();
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("趣味ボタンをクリックすると該当趣味のログだけ残る", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "ランニング" }));
    const links = screen.getAllByRole("link", { name: "ランニング" });
    expect(links.length).toBeGreaterThan(0);
  });

  it("絞り込み後に「絞り込みを解除」ボタンが表示される", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "ランニング" }));
    expect(screen.getByRole("button", { name: "絞り込みを解除" })).toBeInTheDocument();
  });

  it("絞り込みを解除すると全件に戻る", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "ランニング" }));
    fireEvent.click(screen.getByRole("button", { name: "絞り込みを解除" }));
    expect(screen.queryByRole("button", { name: "絞り込みを解除" })).not.toBeInTheDocument();
  });

  it("存在しないフィルタ適用時に空メッセージを表示する", () => {
    renderPage("?hobby=存在しないslug");
    expect(screen.getByText("該当する活動ログが見つかりません。")).toBeInTheDocument();
  });

  it("hobby クエリパラメータで初期絞り込みが反映される", () => {
    renderPage("?hobby=running");
    const links = screen.getAllByRole("link", { name: "ランニング" });
    expect(links.length).toBeGreaterThan(0);
  });
});
