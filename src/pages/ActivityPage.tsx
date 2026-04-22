import { Link, useSearchParams } from "react-router-dom";

import { getAllActivityLogs, getPublishedHobbies } from "../content/hobbies";

export function ActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeHobby = searchParams.get("hobby") ?? "";
  const activeCategory = searchParams.get("category") ?? "";

  const publishedHobbies = getPublishedHobbies();
  const allCategories = [...new Set(publishedHobbies.map((h) => h.category))];

  const logs = getAllActivityLogs(activeHobby || undefined, activeCategory || undefined);

  function toggleHobby(slug: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (next.get("hobby") === slug) {
        next.delete("hobby");
      } else {
        next.set("hobby", slug);
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
        next.delete("hobby");
      }
      return next;
    });
  }

  function clearFilter() {
    setSearchParams({});
  }

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">活動ログ</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">すべての活動記録</h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
          各テーマの活動ログを時系列でまとめて追えるようにした。趣味別・カテゴリ別に絞り込みもできる。
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-900/5 bg-stone-50 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">趣味</span>
          {publishedHobbies.map((hobby) => (
            <button
              key={hobby.slug}
              onClick={() => toggleHobby(hobby.slug)}
              aria-pressed={activeHobby === hobby.slug}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeHobby === hobby.slug
                  ? "bg-slate-950 text-white"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200"
              }`}
            >
              {hobby.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">カテゴリ</span>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? "bg-teal-600 text-white"
                  : "bg-stone-100 text-slate-600 hover:bg-stone-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {(activeHobby || activeCategory) && (
          <button onClick={clearFilter} className="text-xs text-slate-500 underline hover:text-slate-700">
            絞り込みを解除
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <p className="text-sm text-slate-500">該当する活動ログが見つかりません。</p>
      ) : (
        <ul className="space-y-3">
          {logs.map((entry) => (
            <li
              key={`${entry.hobbySlug}-${entry.date}-${entry.title}`}
              className="flex gap-4 rounded-[1.5rem] border border-slate-900/10 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
            >
              <div className="shrink-0">
                <p className="text-xs font-semibold text-slate-400">{entry.date}</p>
                <Link
                  to={`/hobbies/${entry.hobbySlug}`}
                  className="mt-1 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 hover:bg-teal-100"
                >
                  {entry.hobbyName}
                </Link>
                <p className="mt-1 text-xs text-slate-400">{entry.hobbyCategory}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-950">{entry.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{entry.description}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
