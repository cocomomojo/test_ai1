import type { Hobby } from "./schema";
import { hobbiesSchema } from "./schema";

const hobbySeed = [
  {
    slug: "running",
    name: "ランニング",
    category: "身体を動かす",
    summary: "走った記録を残しながら、無理なく続けるための工夫をまとめる。",
    detail:
      "週3回のランニングを中心に、ルート、シューズ、振り返りを静かに積み上げていく。速さよりも、気分よく続けられる形を大事にする。",
    status: "active",
    cadence: "週3回",
    currentFocus: "10kmを気持ちよく走れるペース作り",
    tags: ["運動", "健康", "記録"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "ルートメモ",
        description: "続けやすいコースと、季節ごとの気づきを短く残す。"
      },
      {
        title: "シューズ記録",
        description: "履き心地や距離感を記録して、次に選ぶ時の判断材料にする。"
      },
      {
        title: "回復ルーティン",
        description: "走った後のストレッチや補給を、再現しやすい形で整理する。"
      }
    ],
    firstReleaseItems: [
      "よく走るコース3本の紹介",
      "今使っているシューズの短評",
      "走った後にやる回復ルーティン"
    ]
  },
  {
    slug: "coffee",
    name: "コーヒー",
    category: "家で楽しむ",
    summary: "豆、抽出、道具の違いを記録して、毎朝の一杯を安定させる。",
    detail:
      "家で淹れるコーヒーを、気分ではなく再現性で楽しめるようにする。豆の特徴、抽出条件、器具ごとの差を、あとで見返しやすい形で残す。",
    status: "active",
    cadence: "毎日",
    currentFocus: "朝の定番レシピを1つ完成させる",
    tags: ["コーヒー", "レシピ", "道具"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "抽出レシピ",
        description: "湯量、時間、挽き目を揃えて、同じ味を再現できるようにする。"
      },
      {
        title: "豆の記録",
        description: "好みだった豆と、次は外したい豆の違いを簡潔に残す。"
      },
      {
        title: "道具メモ",
        description: "ドリッパーやミルの使い勝手を、買い替え判断にも使える形で整理する。"
      }
    ],
    firstReleaseItems: [
      "毎朝使っている抽出レシピ",
      "最近よかった豆のメモ",
      "手元の道具の使い分け"
    ]
  },
  {
    slug: "making",
    name: "小さな制作",
    category: "つくる",
    summary: "サイト改善や小さな自動化など、手を動かして試したことを残す。",
    detail:
      "完成品を並べるよりも、少しずつ作っては直した過程を残すための場所。UIの試作、運用改善、自動化メモを次の改善サイクルにつなげる。",
    status: "incubating",
    cadence: "週末",
    currentFocus: "趣味サイトを少しずつ育てるUIと運用の試作",
    tags: ["制作", "UI", "自動化"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "UI実験",
        description: "ページの見せ方や、一覧から詳細への導線を小さく試す。"
      },
      {
        title: "自動化メモ",
        description: "Issue、PR、テスト運用の改善案を、次のサイクルで使える形にする。"
      },
      {
        title: "次の仮説",
        description: "タグ、検索、活動ログなど、次に伸ばす候補を整理しておく。"
      }
    ],
    firstReleaseItems: [
      "このサイトで試したいUIの方向性",
      "IssueとPR運用のメモ",
      "次サイクルで試す改善候補"
    ]
  }
] satisfies Hobby[];

export const hobbies = hobbiesSchema.parse(hobbySeed);

export function getHobbyBySlug(slug: string) {
  return hobbies.find((hobby) => hobby.slug === slug);
}
