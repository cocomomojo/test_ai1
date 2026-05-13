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
  it("DIY の工具選びと代用品の記事を表示する", () => {
    renderArticle("/hobbies/diy/articles/tool-selection-and-substitutes");

    expect(screen.getByRole("heading", { name: "買い足しを増やしすぎない工具の選び方と代用品の考え方" })).toBeInTheDocument();
    expect(screen.getByText("2026-05-12")).toBeInTheDocument();
  });

  it("工具の3区分表を表示する", () => {
    renderArticle("/hobbies/diy/articles/tool-selection-and-substitutes");

    expect(screen.getByText("必携・あると楽・代用で足りるの3区分")).toBeInTheDocument();
    expect(screen.getByText("必携")).toBeInTheDocument();
    expect(screen.getByText("あると楽")).toBeInTheDocument();
    expect(screen.getByText("代用で足りる")).toBeInTheDocument();
  });

  it("作業前の5列判断表を表示する", () => {
    renderArticle("/hobbies/diy/articles/tool-selection-and-substitutes");

    expect(screen.getByText("作業前に見る判断表")).toBeInTheDocument();
    expect(screen.getByText("買い足し判断")).toBeInTheDocument();
    expect(screen.getByText("次回メモ")).toBeInTheDocument();
    expect(screen.getAllByText("メジャー").length).toBeGreaterThan(0);
    expect(screen.getAllByText("電動ドリル").length).toBeGreaterThan(0);
  });

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

  it("カレーの3段階整理記事と画像を表示する", () => {
    renderArticle("/hobbies/curry/articles/curry-three-step-stability");

    expect(screen.getByRole("heading", { name: "家カレーの再現性を上げる「味のぶれを減らす3段階整理」" })).toBeInTheDocument();
    expect(screen.getByText("2026-05-09")).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "家カレーで固定する条件、1回ごとに試す項目、食後メモを次回へ返す流れ図"
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText("ベース・量・鍋サイズを先に固定し、今回は1項目だけ動かして、食べた印象を次回の1点調整に返す流れを図にした。")
    ).toBeInTheDocument();
  });

  it("カレーの3列表を表示する", () => {
    renderArticle("/hobbies/curry/articles/curry-three-step-stability");

    expect(screen.getByText("変える前に固定する3列表")).toBeInTheDocument();
    expect(screen.getByText("変える前に固定する項目")).toBeInTheDocument();
    expect(screen.getByText("1回ごとに試す項目")).toBeInTheDocument();
    expect(screen.getByText("記録する項目")).toBeInTheDocument();
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

  it("ランニングのシューズ記録記事を表示する", () => {
    renderArticle("/hobbies/running/articles/shoe-switch-sensory-memo");

    expect(screen.getByRole("heading", { name: "シューズを替えた日の感覚メモの残し方" })).toBeInTheDocument();
    expect(screen.getByText("2026-05-11")).toBeInTheDocument();
  });

  it("シューズ記録記事の条件固定表と週次比較表を表示する", () => {
    renderArticle("/hobbies/running/articles/shoe-switch-sensory-memo");

    expect(screen.getByText("差分をシューズに寄せるための条件固定表")).toBeInTheDocument();
    expect(screen.getByText("ルート")).toBeInTheDocument();
    expect(screen.getByText("翌朝評価")).toBeInTheDocument();
    expect(screen.getByText("週末は現行/新しいシューズを同じ観点で比較する")).toBeInTheDocument();
    expect(screen.getByText("観点")).toBeInTheDocument();
  });

  it("ウォーキングの3行メモ記事を表示する", () => {
    renderArticle("/hobbies/walking/articles/green-route-mood-memo");

    expect(screen.getByRole("heading", { name: "緑の多いルートと気分変化の関係を3行メモで見える化する" })).toBeInTheDocument();
    expect(screen.getByText("2026-05-05")).toBeInTheDocument();
  });

  it("ルート比較表を表示する", () => {
    renderArticle("/hobbies/walking/articles/green-route-mood-memo");

    expect(screen.getByText("ルートを比較する観点")).toBeInTheDocument();
    expect(screen.getByText("ルート種別")).toBeInTheDocument();
    expect(screen.getByText("緑の多いルート")).toBeInTheDocument();
    expect(screen.getByText("幹線道路沿い")).toBeInTheDocument();
  });

  it("3行メモテンプレートの表を表示する", () => {
    renderArticle("/hobbies/walking/articles/green-route-mood-memo");

    expect(screen.getByText("天気・時間帯・気分の3行メモの型")).toBeInTheDocument();
    expect(screen.getByText("1行目")).toBeInTheDocument();
    expect(screen.getByText("2行目")).toBeInTheDocument();
    expect(screen.getByText("3行目")).toBeInTheDocument();
  });

  it("ウォーキングの交互運用記事を表示する", () => {
    renderArticle("/hobbies/walking/articles/running-walking-weekly-recovery");

    expect(screen.getByRole("heading", { name: "ランニングとウォーキングを交互に入れる1週間の組み方と回復体感メモ" })).toBeInTheDocument();
    expect(screen.getByText("2026-05-07")).toBeInTheDocument();
  });

  it("1週間の並べ方例の表を表示する", () => {
    renderArticle("/hobbies/walking/articles/running-walking-weekly-recovery");

    expect(screen.getByText("1週間の並べ方例")).toBeInTheDocument();
    expect(screen.getByText("曜日")).toBeInTheDocument();
    expect(screen.getByText("月")).toBeInTheDocument();
    expect(screen.getByText("日")).toBeInTheDocument();
  });

  it("回復サインと3行メモ転用の表を表示する", () => {
    renderArticle("/hobbies/walking/articles/running-walking-weekly-recovery");

    expect(screen.getByText("ラン翌朝に見る回復サイン")).toBeInTheDocument();
    expect(screen.getByText("サイン")).toBeInTheDocument();
    expect(screen.getByText("ウォーキング方針")).toBeInTheDocument();
    expect(screen.getByText("ウォーキング3行メモの転用法")).toBeInTheDocument();
    expect(screen.getByText("ラン翌朝向けの記入例")).toBeInTheDocument();
  });
});
