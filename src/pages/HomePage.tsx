import { Link } from "react-router-dom";

import { getPublishedHobbies, getRecentActivityLogs } from "../content/hobbies";

export function HomePage() {
  const publishedHobbies = getPublishedHobbies();
  const recentLogs = getRecentActivityLogs(5);
  const totalDraftAngles = publishedHobbies.reduce((count, hobby) => count + hobby.draftAngles.length, 0);
  const totalInnovationIdeas = publishedHobbies.reduce(
    (count, hobby) => count + hobby.innovationIdeas.length,
    0
  );
  const totalCategories = new Set(publishedHobbies.map((hobby) => hobby.category)).size;

  return (
    <section className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative overflow-hidden rounded-[2.2rem] bg-slate-950 px-8 py-10 text-stone-50 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.18),transparent_32%)]" />
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-[0.35em] text-teal-300">趣味と学びのベース</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
              手を動かすテーマと技術の観察を、毎日更新できる形に整える。
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              ランニング、コーヒー、小さな制作に加えて、DIY、カレー、DevOps まで広げた。
              機能改善は提案ベースで進め、コンテンツは日々の下書きをためながら公開判断を分ける。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hobbies"
                className="rounded-full bg-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-200"
              >
                趣味一覧を見る
              </Link>
              <a
                href="https://github.com/cocomomojo/test_ai1"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                GitHub で確認する
              </a>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">機能側</p>
                <p className="mt-2 text-lg font-semibold text-white">日次の提案 issue</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">何を作るかを毎日比較し、着手候補を絞る。</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">コンテンツ側</p>
                <p className="mt-2 text-lg font-semibold text-white">日次の下書き issue</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">著作権に触れない自前の視点で、公開前の下書きを蓄積する。</p>
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-300">公開判断</p>
                <p className="mt-2 text-lg font-semibold text-white">人が最終確認</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">自動生成は下書きまでに止め、品質と安全性を保つ。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">収録中のテーマ</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{publishedHobbies.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Zod で検証したデータを土台に、テーマを増やしても構造が崩れにくい状態にしている。
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">次の下書き角度</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{totalDraftAngles}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">毎日の content draft issue で回す種をここにためている。</p>
            </div>
            <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">組み合わせ仮説</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">{totalInnovationIdeas}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">道具、習慣、運用をどう掛け合わせるかの案を可視化している。</p>
            </div>
          </div>
          <div className="rounded-[1.6rem] border border-slate-900/10 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">カテゴリ</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{totalCategories}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              身体、暮らし、台所、制作、技術を横断しながら、同じ記録の型で見比べられる。
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-900/10 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">テーママップ</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              今どのテーマを、どの角度で深掘りするか
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            一覧と詳細だけで終わらせず、次に書くべき下書き角度まで同じ画面で把握できるようにした。
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-900/10">
          <table className="min-w-full divide-y divide-slate-900/10 text-left text-sm">
            <thead className="bg-stone-100 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">テーマ</th>
                <th className="px-4 py-3 font-semibold">カテゴリ</th>
                <th className="px-4 py-3 font-semibold">いまの注力点</th>
                <th className="px-4 py-3 font-semibold">次の下書き候補</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/10 bg-white">
              {publishedHobbies.map((hobby) => (
                <tr key={hobby.slug} className="align-top">
                  <td className="px-4 py-4 font-semibold text-slate-950">{hobby.name}</td>
                  <td className="px-4 py-4 text-slate-600">{hobby.category}</td>
                  <td className="px-4 py-4 text-slate-700">{hobby.currentFocus}</td>
                  <td className="px-4 py-4 text-slate-700">{hobby.draftAngles[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {recentLogs.length > 0 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">最近の更新</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                最近の活動ログ
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              各テーマで最近やったことを時系列で見られるようにした。
            </p>
          </div>
          <ul className="mt-6 space-y-3">
            {recentLogs.map((entry) => (
              <li key={`${entry.hobbySlug}-${entry.date}-${entry.title}`} className="flex gap-4 rounded-[1.5rem] border border-slate-900/10 bg-stone-50 px-5 py-4">
                <div className="shrink-0">
                  <p className="text-xs font-semibold text-slate-400">{entry.date}</p>
                  <Link
                    to={`/hobbies/${entry.hobbySlug}`}
                    className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                  >
                    {entry.hobbyName}
                  </Link>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{entry.title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{entry.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {publishedHobbies.map((hobby) => (
          <article key={hobby.slug} className="rounded-[1.6rem] border border-slate-900/10 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-lg font-semibold text-slate-950">{hobby.name}</h4>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-slate-600">
                {hobby.cadence}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{hobby.summary}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {hobby.snapshot.map((metric) => (
                <div key={metric.label} className="rounded-2xl bg-stone-100 px-3 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{metric.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">次に深掘りしたいこと</p>
            <p className="mt-2 text-sm leading-6 text-slate-800">{hobby.draftAngles[0]}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
