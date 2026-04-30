import type { CategoryDefinition, TagDefinition } from "./schema";
import { categoriesDefinitionSchema, tagsDefinitionSchema } from "./schema";

// slug は hobby.category の値と一致させ getCategoryBySlug のキーとして使う。
// label は将来的に表示文言が slug と異なる場合（例: URL スラグを英語にする場合）に備えて分離してある。
const categorySeed = [
  {
    slug: "身体を動かす",
    label: "身体を動かす",
    description: "ランニングなど体を動かすことを中心に記録・改善するテーマ。"
  },
  {
    slug: "家で楽しむ",
    label: "家で楽しむ",
    description: "コーヒーなど自宅でじっくり楽しむ趣味の記録とレシピ研究。"
  },
  {
    slug: "つくる",
    label: "つくる",
    description: "UI 試作・自動化など、手を動かして形にしていく制作テーマ。"
  },
  {
    slug: "暮らしを整える",
    label: "暮らしを整える",
    description: "DIY・収納など、日常の空間や生活動線を少しずつ改善するテーマ。"
  },
  {
    slug: "台所で試す",
    label: "台所で試す",
    description: "カレーなど、台所を実験の場にして再現性を高める料理テーマ。"
  },
  {
    slug: "技術を育てる",
    label: "技術を育てる",
    description: "CI/CD・AWS・E2E・AI など、技術動向を自分の運用に引き寄せて整理するテーマ。"
  }
] satisfies CategoryDefinition[];

const tagSeed = [
  { label: "運動", description: "体を動かす活動全般に関するタグ。" },
  { label: "健康", description: "身体のコンディションや回復に関するタグ。" },
  { label: "記録", description: "継続的な記録・ログ管理に関するタグ。" },
  { label: "コーヒー", description: "コーヒーの抽出・豆・道具に関するタグ。" },
  { label: "レシピ", description: "再現可能な手順・レシピの整理に関するタグ。" },
  { label: "道具", description: "器具・工具・アイテムの選択・管理に関するタグ。" },
  { label: "制作", description: "UI 試作や小さなものを作ること全般のタグ。" },
  { label: "UI", description: "画面設計・見た目の改善に関するタグ。" },
  { label: "自動化", description: "GitHub Actions など繰り返し作業を自動化するタグ。" },
  { label: "DIY", description: "小修繕・収納改善など自分で行う工作全般のタグ。" },
  { label: "工具", description: "DIY で使う工具の選択・管理に関するタグ。" },
  { label: "収納", description: "空間の整理・収納の工夫に関するタグ。" },
  { label: "料理", description: "台所での料理・食材の扱いに関するタグ。" },
  { label: "スパイス", description: "スパイスの配合・調整に関するタグ。" },
  { label: "DevOps", description: "CI/CD・インフラ・運用改善をまとめるタグ。" },
  { label: "CI/CD", description: "継続的インテグレーション・デリバリに関するタグ。" },
  { label: "AWS", description: "AWS クラウドサービスの活用に関するタグ。" },
  { label: "E2E", description: "エンドツーエンドテストの実践・運用に関するタグ。" },
  { label: "AI", description: "AI ツールの提案・補助活用に関するタグ。" }
] satisfies TagDefinition[];

export const categories = categoriesDefinitionSchema.parse(categorySeed);
export const tags = tagsDefinitionSchema.parse(tagSeed);

export function getCategoryBySlug(slug: string): CategoryDefinition | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTagByLabel(label: string): TagDefinition | undefined {
  return tags.find((t) => t.label === label);
}
