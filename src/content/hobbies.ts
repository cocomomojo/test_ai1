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
    snapshot: [
      {
        label: "頻度",
        value: "週3回",
        note: "短いメモを翌朝までに残し、調子の波を追えるようにする。"
      },
      {
        label: "距離感",
        value: "5-10km",
        note: "気温と路面で無理に伸ばさず、続けやすい帯を守る。"
      },
      {
        label: "回復",
        value: "20分",
        note: "給水・補給・ストレッチの順を固定し、睡眠メモまで揃えると翌朝の体感が安定してきた。"
      }
    ],
    tags: ["運動", "健康", "記録"],
    updatedAt: "2026-04-20",
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
        description: "ラン直後から就寝前までの手順を時系列で整理し、翌朝の体感と照合できる形にする。"
      }
    ],
    focusTable: [
      {
        theme: "ペース",
        current: "会話できる速さを基準にして走っている。",
        signal: "最後の2kmだけ少し上げると全体のリズムが整いやすい。",
        nextAction: "週1回のビルドアップ走を短い振り返り付きで試す。"
      },
      {
        theme: "記録",
        current: "距離、時間、気分を手入力で残している。",
        signal: "記録フォーマットを揃えると見返しやすさが大きく上がる。",
        nextAction: "ルート、天気、疲労感の3点セットで記録テンプレを固定する。"
      },
      {
        theme: "回復",
        current: "ラン直後に給水→補給→ストレッチの順で15分、就寝前に睡眠メモを残している。",
        signal: "この順番を守った日は翌朝の重さが体感で1段階軽い。睡眠メモで相関が確認できてきた。",
        nextAction: "回復ステップと翌朝体感を3段階評価で記録し、疲れが抜けやすい条件を絞り込む。"
      }
    ],
    innovationIdeas: [
      {
        title: "気分優先ルート提案",
        combination: "天気 x 体調 x ルートメモ",
        summary: "走る前の気分と天候から、その日に向くコースを選ぶ小さなレコメンドに育てる。"
      },
      {
        title: "回復の見える化カード",
        combination: "ラン後記録 x 睡眠メモ x 翌朝体感",
        summary: "給水→補給→ストレッチ→睡眠の4ステップを時系列で記録し、翌朝の疲労感と対応させて継続しやすい負荷帯を見つける。"
      }
    ],
    draftAngles: [
      "気温別に走りやすかったルートの比較",
      "シューズを替えた日の感覚メモの残し方",
      "疲労が抜けやすかった回復ルーティンの順番と翌朝体感の記録方法"
    ],
    firstReleaseItems: [
      "よく走るコース3本の紹介",
      "今使っているシューズの短評",
      "ラン直後から就寝前までの回復ルーティン手順と翌朝3段階評価テンプレ"
    ],
    activityLog: [
      {
        date: "2026-04-20",
        title: "回復ルーティンを時系列で整理した",
        description: "ラン直後の給水→補給→ストレッチから就寝前の睡眠メモまでを手順カードにまとめた。翌朝体感を3段階で記録するテンプレも合わせて作り、疲れが抜けやすい条件を追えるようにした。"
      },
      {
        date: "2026-04-19",
        title: "10kmビルドアップ走を試した",
        description: "後半2kmだけペースを上げる構成で走り、全体のリズムが整いやすくなった。次回も同じ構成で継続する。"
      },
      {
        date: "2026-04-12",
        title: "回復ルーティンに睡眠メモを追加",
        description: "走後の記録に睡眠時間と起床時の疲労感を書き始めた。翌日の重さとの相関が少しずつ見えてきた。"
      },
      {
        date: "2026-04-05",
        title: "記録テンプレを3点セットに固定",
        description: "ルート・天気・疲労感の3項目で記録を統一した。見返しやすさが大きく上がった。"
      }
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
    snapshot: [
      {
        label: "抽出",
        value: "1日1杯",
        note: "朝の一杯を軸に、条件を少しずつ固定していく。"
      },
      {
        label: "豆",
        value: "2種類",
        note: "迷いすぎないよう、常備豆は少数に絞って比較する。"
      },
      {
        label: "記録",
        value: "3項目",
        note: "湯量、時間、挽き目だけは毎回残して再現性を作る。"
      }
    ],
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
    focusTable: [
      {
        theme: "レシピ",
        current: "湯量と時間を揃えて味を安定させている。",
        signal: "朝は変数を増やさない方が継続しやすい。",
        nextAction: "定番レシピと気分転換レシピの2系統に分けて記録する。"
      },
      {
        theme: "豆選び",
        current: "好みだった豆を簡潔にメモしている。",
        signal: "焙煎度と香りの言語化を揃えると比較しやすい。",
        nextAction: "香り、甘さ、後味の3軸で短評テンプレを作る。"
      },
      {
        theme: "道具",
        current: "ミルとドリッパーの違いを感覚で残している。",
        signal: "洗いやすさや準備時間も満足度に強く効く。",
        nextAction: "味だけでなく、準備と片付けの時間も表に残す。"
      }
    ],
    innovationIdeas: [
      {
        title: "朝専用の一杯テンプレ",
        combination: "起床時間 x 豆 x 抽出時間",
        summary: "迷わず淹れられる朝の定番を作り、平日の認知負荷を下げる。"
      },
      {
        title: "在庫から逆算する抽出メモ",
        combination: "豆の残量 x お湯の温度 x 器具",
        summary: "豆の使い切りまで見通した記録にして、買いすぎや迷いを減らす。"
      }
    ],
    draftAngles: [
      "朝の定番レシピを固定した時のメリットと欠点",
      "同じ豆を器具違いで淹れた時の印象差",
      "買い替え前に役立つ道具メモの書き方"
    ],
    firstReleaseItems: [
      "毎朝使っている抽出レシピ",
      "最近よかった豆のメモ",
      "手元の道具の使い分け"
    ],
    activityLog: [
      {
        date: "2026-04-18",
        title: "定番レシピと気分転換レシピを分けて記録開始",
        description: "平日用の固定レシピと週末の試し淹れを別枠で残すようにした。比較がしやすくなった。"
      },
      {
        date: "2026-04-10",
        title: "豆の短評テンプレを3軸に整理",
        description: "香り・甘さ・後味の3項目で短評を書き始めた。豆同士の比較が以前より明確になった。"
      }
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
    snapshot: [
      {
        label: "試作",
        value: "週末1本",
        note: "大きく作り込まず、1つずつ試して戻せる単位に保つ。"
      },
      {
        label: "改善",
        value: "小刻み",
        note: "UI と運用の改善を分けず、同じサイクルで見直す。"
      },
      {
        label: "記録",
        value: "Issue起点",
        note: "試した理由と結果を次の作業につながる形で残す。"
      }
    ],
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
    focusTable: [
      {
        theme: "UI",
        current: "一覧から詳細までの導線を少しずつ磨いている。",
        signal: "見た目だけでなく、更新しやすさも同時に整える必要がある。",
        nextAction: "カードと詳細ページの両方で再利用できる情報粒度を定める。"
      },
      {
        theme: "運用",
        current: "Issue、PR、テストの流れを手で整えている。",
        signal: "提案と公開判断を分けると日次運用が軽くなる。",
        nextAction: "機能提案とコンテンツ下書きの issue を分けて回す。"
      },
      {
        theme: "自動化",
        current: "小さなスクリプトと GitHub Actions を追加している。",
        signal: "自動化は公開より下書き生成に使う方が安全に回る。",
        nextAction: "毎日のコンテンツ下書き issue を生成する。"
      }
    ],
    innovationIdeas: [
      {
        title: "提案から公開までの一枚絵",
        combination: "Issue x UI試作 x README",
        summary: "運用と画面の関係を見える化し、次に何を改善するか迷わない状態を作る。"
      },
      {
        title: "小さな自動化の再利用化",
        combination: "GitHub Actions x コンテンツ下書き",
        summary: "単発スクリプトを運用資産に変え、趣味サイトの更新リズムを軽くする。"
      }
    ],
    draftAngles: [
      "UI 改善と運用改善を一緒に進める時の考え方",
      "毎日使える issue 自動化の粒度",
      "このサイトで次に試したい導線の仮説"
    ],
    firstReleaseItems: [
      "このサイトで試したいUIの方向性",
      "IssueとPR運用のメモ",
      "次サイクルで試す改善候補"
    ]
  },
  {
    slug: "diy",
    name: "DIY",
    category: "暮らしを整える",
    summary: "小修繕や収納改善を、再現しやすい工程メモとして残す。",
    detail:
      "大掛かりな改装ではなく、週末にできる小さな DIY を中心に扱う。採寸、工具、失敗しやすかった点を記録し、次に同じ作業をするときの迷いを減らす。",
    status: "active",
    cadence: "月2回",
    currentFocus: "収納と小修繕を写真なしでも再現できる工程メモにする",
    snapshot: [
      {
        label: "対象",
        value: "収納 + 修繕",
        note: "暮らしに効く小さな改善だけを扱い、やり切れる範囲を守る。"
      },
      {
        label: "時間",
        value: "半日",
        note: "週末の半日で終わる作業に絞り、継続できる密度に保つ。"
      },
      {
        label: "道具",
        value: "最小構成",
        note: "買い足しを増やしすぎず、手元で回る工具セットを前提にする。"
      }
    ],
    tags: ["DIY", "工具", "収納"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "工程カード",
        description: "作業前の確認、手順、失敗しやすい点を短いカードで残す。"
      },
      {
        title: "工具メモ",
        description: "手元にある工具で足りたか、代用品で困らなかったかを記録する。"
      },
      {
        title: "採寸の残し方",
        description: "買い物前に必要な寸法だけを見返せるよう、メモの型を決める。"
      }
    ],
    focusTable: [
      {
        theme: "採寸",
        current: "必要な寸法を手書きメモで残している。",
        signal: "買い物前に見返せる形にしておくと失敗が減る。",
        nextAction: "幅、高さ、奥行き、余白の4項目テンプレを固定する。"
      },
      {
        theme: "工程",
        current: "作業の順番は頭の中で組み立てている。",
        signal: "先に養生や片付けまで書くと疲れにくい。",
        nextAction: "作業前、作業中、片付けの3段で工程カードを作る。"
      },
      {
        theme: "道具",
        current: "必要になった時だけ買い足している。",
        signal: "よく使う工具だけ把握すると判断が軽くなる。",
        nextAction: "使用頻度と代用品の可否を一覧化する。"
      }
    ],
    innovationIdeas: [
      {
        title: "失敗しにくい工程ボード",
        combination: "採寸 x 工程カード x 片付けメモ",
        summary: "作業前後の見落としを減らし、短時間でも取りかかりやすくする。"
      },
      {
        title: "買い物前チェックの標準化",
        combination: "寸法 x 在庫工具 x 予備部材",
        summary: "現場に戻ってから足りないものに気づく回数を減らす。"
      }
    ],
    draftAngles: [
      "半日で終わる収納改善の進め方",
      "採寸メモで最低限残したい項目",
      "買い足しを増やしすぎない工具の選び方"
    ],
    firstReleaseItems: [
      "収納改善で使った工程カード",
      "手元の工具の短評",
      "採寸メモのテンプレ"
    ]
  },
  {
    slug: "curry",
    name: "カレー",
    category: "台所で試す",
    summary: "スパイス、火加減、寝かせ方を整理して、家で作る一皿の再現性を上げる。",
    detail:
      "家庭の台所で無理なく続けられるカレー作りを扱う。味の派手さよりも、香り、甘み、辛さのバランスを安定させるための記録を残し、季節や食べる時間帯に合わせて調整していく。",
    status: "active",
    cadence: "週1回",
    currentFocus: "ベースとなる玉ねぎとスパイス配合を1つ安定させる",
    snapshot: [
      {
        label: "頻度",
        value: "週1回",
        note: "繰り返し作る前提で、材料と工程を増やしすぎない。"
      },
      {
        label: "軸",
        value: "香り・甘み・辛さ",
        note: "味の印象を3軸で残し、感覚語を減らしていく。"
      },
      {
        label: "仕上げ",
        value: "翌日確認",
        note: "作りたてと翌日の差まで見て、配合の良し悪しを判断する。"
      }
    ],
    tags: ["料理", "スパイス", "レシピ"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "ベース記録",
        description: "玉ねぎ、トマト、油量の比率を見返しやすく残す。"
      },
      {
        title: "スパイス配合",
        description: "香りと辛さがどう変わったかを少量の比較で確認する。"
      },
      {
        title: "食べるタイミング",
        description: "昼と夜、作りたてと翌日で印象がどう変わるかを見る。"
      }
    ],
    focusTable: [
      {
        theme: "ベース",
        current: "玉ねぎの炒め具合を感覚で決めている。",
        signal: "色だけでなく香りの変化も残すと再現しやすい。",
        nextAction: "炒め時間、香り、色の3点で状態を記録する。"
      },
      {
        theme: "配合",
        current: "よかった配合を断片的にメモしている。",
        signal: "辛さと香りを別軸で残すと調整しやすい。",
        nextAction: "基本配合からの差分だけを書く方式に変える。"
      },
      {
        theme: "仕上げ",
        current: "作りたての印象を重視している。",
        signal: "翌日のまとまり方で良し悪しが逆転することがある。",
        nextAction: "作りたてと翌日の2段評価で記録する。"
      }
    ],
    innovationIdeas: [
      {
        title: "気温別カレーチューニング",
        combination: "季節 x 辛さ x 食べる時間帯",
        summary: "暑い日と寒い日で求める後味が違うことを前提に、配合を軽く調整する。"
      },
      {
        title: "在庫から組み立てる一皿",
        combination: "残りスパイス x 冷蔵庫 x 仕上げ",
        summary: "買い足し前提ではなく、家にあるもので回るレシピ設計にする。"
      }
    ],
    draftAngles: [
      "ベースの炒め具合をどう言葉で残すか",
      "同じ配合を翌日に食べた時の違い",
      "スパイス在庫から逆算する週末カレー"
    ],
    firstReleaseItems: [
      "定番ベースの工程メモ",
      "スパイス配合の比較表",
      "翌日に食べた時の印象メモ"
    ]
  },
  {
    slug: "devops",
    name: "DevOps",
    category: "技術を育てる",
    summary:
      "CI/CD、AWS、E2E、AI の動向を自分の運用に引き寄せて整理し、新しい組み合わせの仮説を考える。",
    detail:
      "外部記事の要約ではなく、自分の開発と運用に照らして何が効きそうかを整理するためのテーマ。CI/CD を軸に、AWS の配信基盤、E2E の品質担保、AI の提案力をつなぎ、少人数でも回せる実践的な運用の形を考える。",
    status: "active",
    cadence: "毎週",
    currentFocus: "CI/CD、AWS、E2E、AI を一本の改善ループとしてつなぐ",
    snapshot: [
      {
        label: "観測軸",
        value: "4領域",
        note: "CI/CD、AWS、E2E、AI を別々ではなく一本の流れとして扱う。"
      },
      {
        label: "仮説",
        value: "3本",
        note: "現実に試せるサイズの組み合わせだけを提案対象にする。"
      },
      {
        label: "更新",
        value: "日次下書き",
        note: "公開より先に issue 下書きを回し、鮮度と安全性を両立する。"
      }
    ],
    tags: ["DevOps", "CI/CD", "AWS", "E2E", "AI"],
    updatedAt: "2026-04-19",
    published: true,
    highlights: [
      {
        title: "CI/CD 動向",
        description: "ビルド・テスト・デプロイを自動化するだけでなく、改善サイクルにどう接続するかを見る。"
      },
      {
        title: "AWS 動向",
        description: "静的配信や preview など、最小構成で運用しやすい設計に引き寄せて考える。"
      },
      {
        title: "E2E と AI の交点",
        description: "回帰確認と提案生成をどうつなぐと、少人数運用でも効率が出るかを考える。"
      }
    ],
    focusTable: [
      {
        theme: "CI/CD",
        current: "build、test、deploy の直列自動化が中心。",
        signal: "変更意図や失敗要因まで扱えると、次の改善が速くなる。",
        nextAction: "PR や issue の文脈を次のテスト候補へ結びつける。"
      },
      {
        theme: "AWS",
        current: "静的配信や軽量ホスティングが中心。",
        signal: "低コストでも preview と観測点を持つ構成が重要になる。",
        nextAction: "Pages と将来の preview 環境を比較できる整理表を作る。"
      },
      {
        theme: "E2E",
        current: "主要導線の回帰確認を最小構成で行っている。",
        signal: "レポート公開や失敗パターンの蓄積が次の価値になる。",
        nextAction: "テスト結果を運用メモに変換する流れを作る。"
      },
      {
        theme: "AI",
        current: "提案、下書き、レビュー補助として使っている。",
        signal: "自動公開より下書き生成と判断補助に寄せる方が安全に回る。",
        nextAction: "日次コンテンツ下書きと機能提案を別 issue で回す。"
      }
    ],
    innovationIdeas: [
      {
        title: "AI レビューから E2E 候補を起票する",
        combination: "PR 文脈 x レビューコメント x Playwright",
        summary: "レビューの論点を次の回帰テスト候補に変え、品質改善の循環を作る。"
      },
      {
        title: "AWS preview とレポート公開を一本化する",
        combination: "軽量 preview 環境 x E2E レポート x 要約",
        summary: "デプロイ結果とテスト結果を同じ文脈で見られるようにし、判断を速くする。"
      },
      {
        title: "運用 issue から次サイクルを編成する",
        combination: "日次下書き issue x 機能提案 issue x Projects",
        summary: "実装候補とコンテンツ候補を別々にためつつ、次のサイクルで組み合わせて選べるようにする。"
      }
    ],
    draftAngles: [
      "CI/CD と AI を組み合わせる時に自動化しすぎない境界",
      "AWS 上で preview と本番をどう分けるかの考え方",
      "E2E レポートを単なる成果物で終わらせない運用"
    ],
    firstReleaseItems: [
      "CI/CD、AWS、E2E、AI の整理表",
      "今考えている組み合わせ仮説 3 本",
      "このサイトで試せる最小の DevOps 改善案"
    ],
    activityLog: [
      {
        date: "2026-04-17",
        title: "日次コンテンツ下書きと機能提案を別 issue で回し始めた",
        description: "これまで1つの issue に混在させていた提案と下書きを分けた。優先判断がしやすくなった。"
      },
      {
        date: "2026-04-09",
        title: "E2E レポートの公開導線を整備",
        description: "Playwright レポートを Pages 上から参照できる配線を完成させた。テスト結果の振り返りが楽になった。"
      },
      {
        date: "2026-04-02",
        title: "CI/CD の直列自動化を確認",
        description: "build → test → deploy の流れが安定して動くことを確認した。失敗時のログ追いやすさも改善した。"
      }
    ]
  }
] satisfies Hobby[];

export const hobbies = hobbiesSchema.parse(hobbySeed);

export function getHobbyBySlug(slug: string) {
  return hobbies.find((hobby) => hobby.slug === slug);
}

export function getPublishedHobbies() {
  return hobbies
    .filter((h) => h.published !== false)
    .sort((a, b) => {
      if (!a.updatedAt && !b.updatedAt) return 0;
      if (!a.updatedAt) return 1;
      if (!b.updatedAt) return -1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function filterHobbies(list: typeof hobbies, tag?: string, category?: string, keyword?: string) {
  const q = keyword?.trim().toLowerCase();
  return list.filter((h) => {
    if (tag && !(h.tags ?? []).includes(tag)) return false;
    if (category && h.category !== category) return false;
    if (q) {
      const haystack = [h.name, h.summary, h.category, ...(h.tags ?? [])].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function getRecentActivityLogs(limit = 5) {
  return getPublishedHobbies()
    .flatMap((hobby) =>
      (hobby.activityLog ?? []).map((entry) => ({ ...entry, hobbySlug: hobby.slug, hobbyName: hobby.name }))
    )
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}
