import { Link } from "react-router-dom";

import { hobbies } from "../content/hobbies";

export function HobbiesPage() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">趣味一覧</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">今このサイトで扱うテーマ</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          最初の公開では、毎週または毎日触れている趣味を中心に、見返しやすい単位でまとめます。
          将来的にはタグ、活動ログ、検索を足せる前提の構造にしてあります。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {hobbies.map((hobby) => (
          <article
            key={hobby.slug}
            className="rounded-[1.5rem] border border-slate-900/10 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-slate-950">{hobby.name}</h3>
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
                {hobby.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.category}</span>
              <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.cadence}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{hobby.summary}</p>
            <div className="mt-4 rounded-2xl bg-stone-100 p-4 text-sm text-slate-700">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                いま注力していること
              </p>
              <p className="mt-2 leading-6">{hobby.currentFocus}</p>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {hobby.firstReleaseItems.map((item) => (
                <li key={item} className="rounded-full bg-stone-100 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to={`/hobbies/${hobby.slug}`}
              className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              詳細を見る
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
