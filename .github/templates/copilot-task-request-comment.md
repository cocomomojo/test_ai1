# Copilot Task Request Comment

このファイルは、Task issue のコメント欄に貼るためのひな形です。
日次 plan issue は候補選定の記録に使い、実行依頼は実装対象の Task issue に assign 前の記録として残します。
このコメントを貼ったあと、対象 issue を Copilot に assign して開始します。

```md
この Task では、issue #[候補を選んだ issue 番号] の候補[番号]を採用します。
以下の条件で進めてください。

## 採用候補
- 元 issue: #[候補選定 issue]
- 採用候補: 候補[番号]
- 対象 Task: #[この Task issue]

## 追加要望
- issue / PR は日本語で作成する
- plan-first コメントから始める
- [追加要望を箇条書き]

## 制約
- [やらないこと / 触らない範囲]

## 完了条件
- 実装が完了している
- 単体テストが通る
- 必要な E2E テストが通る
- PR が作成されている
- Copilot code review を依頼している

## 実行指示
- まずこの issue に plan-first をコメントしてください
- 問題がなければ、そのまま実装、テスト、PR 作成、Copilot code review まで進めてください
```

補足:

- 追加要望は、assign 前なら issue コメントで追記する
- assign 後の追加要望や軌道修正は PR コメントに残す
- 対象 issue への assign が実際の開始トリガーになる
- Copilot は assignment 時点の issue 本文と既存コメントを読む前提にする