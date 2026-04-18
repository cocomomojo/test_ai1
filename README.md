# test_ai1

## やりたいこと

- 制限
  - github pro 契約範囲内
  - 機密情報は外部に出さない（tokenなど、個人情報など）

- 私の趣味の静的サイト　を作成
  - frontend:react latest（ライブラリはメジャーなものを使用）
  - backend:必要なら軽いもの
  - db:必要なら軽いもの
  - ログイン画面は不要
　
- 運用サイクルは以下の通り
  - copilotがプランをいくつか提案
  - 私がプランを選択
  - 私が、実装対象の Task issue コメント欄に採用候補と追加要望を書き、`@copilot` で依頼する
  - copilotが設計、実行、テスト（単体テスト、E2Eテスト）、PR（copilotレビュー済）
  - 私がPRを確認し、マージ
  - 上記を繰り返す（静的サイトを改善、拡張。そのため、最初はミニマム機能でよい）

- ai agents instructions　Skills など作成されていること
- 失敗、成果、などをナレッジ蓄積し、workspacesが成長できること
- 最新の技術を取り入れられていること

## 日次 plan issue 自動化

- workflow: `.github/workflows/daily-plan-issue.yml`
- 実行タイミング: 毎日 07:00 JST と `workflow_dispatch`
- 生成内容: Copilot CLI が `PLAN.md`、`README.md`、open / recent issues を元に、その日の plan issue 本文を日本語で生成
- issue タイトル: `日次プラン提案 YYYY-MM-DD`
- 重複防止: 同日の open issue があれば新規起票をスキップ

必要な secret:

- `COPILOT_CLI_TOKEN`
  - fine-grained PAT を作成し、`Copilot Requests` 権限を付与する
  - issue の作成自体は workflow 標準の `GITHUB_TOKEN` を使う

手動確認方法:

- Actions から `Daily Plan Issue` を実行する
- `dry_run` を `true` にすると、issue は作らず本文だけをログに出す
- `plan_date` を指定すると、その日付のタイトルで重複判定する

## Copilot 実行依頼の運用

- 日次 plan issue は「候補選定の記録」に使う
- 実装依頼は、実装対象の Task issue コメント欄に残す
- コメントには、採用候補、追加要望、制約、完了条件を書く
- Copilot への依頼は `@copilot` を付けて行う
- Copilot は、その issue コメントを起点に plan-first、実装、単体テスト、E2E テスト、PR 作成、Copilot code review まで進める想定にする
- issue / PR / issue comment は日本語で残す

コメントのひな形:

- `.github/templates/copilot-task-request-comment.md` をコピーして使う
