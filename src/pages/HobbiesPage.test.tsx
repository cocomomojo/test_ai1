import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { HobbiesPage } from "./HobbiesPage";

function renderPage(search = "") {
  render(
    <MemoryRouter initialEntries={[`/hobbies${search}`]}>
      <HobbiesPage />
    </MemoryRouter>
  );
}

describe("HobbiesPage", () => {
  it("公開済みの趣味を全件表示する", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "コーヒー" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "小さな制作" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "DIY" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "カレー" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "DevOps" })).toBeInTheDocument();
  });

  it("タグが趣味カードに表示される", () => {
    renderPage();
    // タグはフィルタボタンとカード内タグの両方に表示される
    expect(screen.getAllByText("運動").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("健康").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("記録").length).toBeGreaterThanOrEqual(1);
  });

  it("更新日が趣味カードに表示される", () => {
    renderPage();
    const updatedLabels = screen.getAllByText(/^更新:/);
    expect(updatedLabels.length).toBeGreaterThan(0);
  });

  it("カテゴリフィルタボタンがすべて表示される", () => {
    renderPage();
    expect(screen.getByRole("button", { name: "身体を動かす" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "家で楽しむ" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "つくる" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "暮らしを整える" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "台所で試す" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "技術を育てる" })).toBeInTheDocument();
  });

  it("カテゴリボタンをクリックすると該当する趣味だけ残る", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "身体を動かす" }));
    expect(screen.getByRole("heading", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "コーヒー" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "小さな制作" })).not.toBeInTheDocument();
  });

  it("タグボタンをクリックすると該当する趣味だけ残る", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "コーヒー" }));
    expect(screen.queryByRole("heading", { name: "ランニング" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "コーヒー" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "カレー" })).not.toBeInTheDocument();
  });

  it("絞り込み後に「絞り込みを解除」ボタンが表示される", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "身体を動かす" }));
    expect(screen.getByRole("button", { name: "絞り込みを解除" })).toBeInTheDocument();
  });

  it("絞り込みを解除すると全件に戻る", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "身体を動かす" }));
    fireEvent.click(screen.getByRole("button", { name: "絞り込みを解除" }));
    expect(screen.getByRole("heading", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "コーヒー" })).toBeInTheDocument();
  });

  it("キーワード検索フィールドが表示される", () => {
    renderPage();
    expect(screen.getByRole("searchbox", { name: "キーワード" })).toBeInTheDocument();
  });

  it("キーワードを入力すると一致する趣味だけ残る", () => {
    renderPage();
    fireEvent.change(screen.getByRole("searchbox", { name: "キーワード" }), {
      target: { value: "ランニング" }
    });
    expect(screen.getByRole("heading", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "コーヒー" })).not.toBeInTheDocument();
  });

  it("キーワード入力後に「絞り込みを解除」ボタンが表示される", () => {
    renderPage();
    fireEvent.change(screen.getByRole("searchbox", { name: "キーワード" }), {
      target: { value: "ランニング" }
    });
    expect(screen.getByRole("button", { name: "絞り込みを解除" })).toBeInTheDocument();
  });

  it("キーワード絞り込み後に解除すると全件に戻る", () => {
    renderPage();
    fireEvent.change(screen.getByRole("searchbox", { name: "キーワード" }), {
      target: { value: "ランニング" }
    });
    fireEvent.click(screen.getByRole("button", { name: "絞り込みを解除" }));
    expect(screen.getByRole("heading", { name: "ランニング" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "コーヒー" })).toBeInTheDocument();
  });

  it("q クエリパラメータでキーワード検索が初期反映される", () => {
    renderPage("?q=コーヒー");
    expect(screen.getByRole("heading", { name: "コーヒー" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "ランニング" })).not.toBeInTheDocument();
  });
});
