import { Link, useParams } from "react-router-dom";

import { getHobbyBySlug } from "../content/hobbies";

export function HobbyDetailPage() {
  const { slug = "" } = useParams();
  const hobby = getHobbyBySlug(slug);

  if (!hobby) {
    return (
      <section className="rounded-[2rem] border border-rose-200 bg-white px-8 py-10">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">未登録</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">この趣味ページはまだ用意されていません。</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
          コンテンツ構造は拡張できるようにしてありますが、この slug はまだ登録されていません。
        </p>
        <Link
          to="/hobbies"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          趣味一覧へ戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[2rem] bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.status}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.category}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.cadence}</span>
        </div>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{hobby.name}</h2>
        {hobby.tags && hobby.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hobby.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{hobby.summary}</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">{hobby.detail}</p>

        <div className="mt-8 rounded-[1.5rem] bg-stone-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            いま注力していること
          </p>
          <p className="mt-2 text-base leading-7 text-slate-900">{hobby.currentFocus}</p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            初回リリースで載せるもの
          </p>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {hobby.firstReleaseItems.map((item) => (
              <li key={item} className="rounded-2xl border border-slate-900/10 px-4 py-3 text-sm text-slate-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
        {hobby.updatedAt && (
          <p className="mt-2 text-xs text-slate-400">更新: {hobby.updatedAt}</p>
        )}
      </article>

      <aside className="rounded-[2rem] border border-slate-900/10 bg-slate-950 px-8 py-10 text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-teal-300">この趣味で残したいこと</p>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
          {hobby.highlights.map((item) => (
            <li key={item.title} className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-slate-300">{item.description}</p>
            </li>
          ))}
        </ul>
        <Link
          to="/hobbies"
          className="mt-6 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        >
          一覧へ戻る
        </Link>
      </aside>
    </section>
  );
}
