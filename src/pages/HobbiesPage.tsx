import { Link, useSearchParams } from "react-router-dom";

import { filterHobbies, getPublishedHobbies } from "../content/hobbies";

export function HobbiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTag = searchParams.get("tag") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  const publishedHobbies = getPublishedHobbies();
  const allCategories = [...new Set(publishedHobbies.map((h) => h.category))];
  const allTags = [...new Set(publishedHobbies.flatMap((h) => h.tags ?? []))];

  const filteredHobbies = filterHobbies(publishedHobbies, activeTag || undefined, activeCategory || undefined);
  const totalDraftAngles = publishedHobbies.reduce((count, hobby) => count + hobby.draftAngles.length, 0);

  function toggleTag(tag: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (next.get("tag") === tag) {
        next.delete("tag");
      } else {
        next.set("tag", tag);
        next.delete("category");
      }
      return next;
    });
  }

  function toggleCategory(cat: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (next.get("category") === cat) {
        next.delete("category");
      } else {
        next.set("category", cat);
        next.delete("tag");
      }
      return next;
    });
  }

  function clearFilter() {
    setSearchParams({});
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">趣味一覧</p>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">今このサイトで扱うテーマ</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            毎週または毎日触れている趣味を中心に、概要、深掘りの切り口、組み合わせ仮説まで一緒に残します。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
          <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">公開テーマ</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{publishedHobbies.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">カテゴリ</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{allCategories.length}</p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">下書き角度</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{totalDraftAngles}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-900/5 bg-stone-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">カテゴリ</span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? "bg-slate-950 text-white"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">タグ</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              aria-pressed={activeTag === tag}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeTag === tag
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {(activeTag || activeCategory) && (
          <button onClick={clearFilter} className="text-xs text-slate-500 underline hover:text-slate-700">
            絞り込みを解除
          </button>
        )}
      </div>

      {filteredHobbies.length === 0 ? (
        <p className="text-sm text-slate-500">該当する趣味が見つかりません。</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredHobbies.map((hobby) => (
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
              {hobby.tags && hobby.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {hobby.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-4 text-sm leading-6 text-slate-600">{hobby.summary}</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {hobby.snapshot.map((metric) => (
                  <div key={metric.label} className="rounded-2xl bg-stone-100 px-3 py-3 text-sm text-slate-700">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-slate-950">{metric.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-stone-100 p-4 text-sm text-slate-700">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  いま注力していること
                </p>
                <p className="mt-2 leading-6">{hobby.currentFocus}</p>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">次に深掘りしたい切り口</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {hobby.draftAngles.slice(0, 2).map((item) => (
                    <li key={item} className="rounded-2xl border border-slate-900/10 px-3 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {hobby.firstReleaseItems.map((item) => (
                  <li key={item} className="rounded-full bg-stone-100 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between gap-4">
                <Link
                  to={`/hobbies/${hobby.slug}`}
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  詳細を見る
                </Link>
                {hobby.updatedAt && (
                  <span className="text-xs text-slate-400">更新: {hobby.updatedAt}</span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
