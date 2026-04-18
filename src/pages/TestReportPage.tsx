export function TestReportPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">テスト品質</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">E2E テストレポート</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          Playwright による E2E スモークテストの実行結果を確認できます。
          CI で生成されたレポートはこのサイトに同梱されています。
        </p>
      </div>

      <div className="rounded-[2rem] border border-slate-900/10 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="space-y-4">
          <div className="rounded-[1.5rem] bg-stone-100 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              テスト対象
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li className="rounded-full bg-white px-3 py-2">ホームページ — 初回リリース導線の表示確認</li>
              <li className="rounded-full bg-white px-3 py-2">趣味一覧ページ — 主要テーマの表示確認</li>
              <li className="rounded-full bg-white px-3 py-2">趣味詳細ページ — ランニングコンテンツの表示確認</li>
            </ul>
          </div>

          <a
            href="/playwright-report/index.html"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            最新のテストレポートを開く
          </a>
          <p className="text-xs text-slate-500">
            ※ レポートは CI 実行後に生成されます。ローカルで確認する場合は{" "}
            <code className="rounded bg-stone-100 px-1 py-0.5 font-mono">
              npx playwright show-report
            </code>{" "}
            を実行してください。
          </p>
        </div>
      </div>
    </section>
  );
}
