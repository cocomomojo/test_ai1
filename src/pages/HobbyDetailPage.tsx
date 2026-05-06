import { Link, useParams } from "react-router-dom";

import { getCategoryBySlug } from "../content/categories";
import { getHobbyBySlug, getPublishedHobbies } from "../content/hobbies";
import { HobbyPoster } from "../components/HobbyPoster";

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

  const relatedHobbies = getPublishedHobbies().filter(
    (h) => h.slug !== hobby.slug && h.category === hobby.category
  );
  const categoryDef = getCategoryBySlug(hobby.category);

  return (
    <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <article className="rounded-[2rem] bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.status}</span>
          <Link
            to={`/hobbies?category=${encodeURIComponent(hobby.category)}`}
            className="rounded-full bg-stone-100 px-3 py-1 transition hover:bg-stone-200"
          >
            {hobby.category}
          </Link>
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.cadence}</span>
        </div>
        <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{hobby.name}</h2>
        {hobby.tags && hobby.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {hobby.tags.map((tag) => (
              <Link
                key={tag}
                to={`/hobbies?tag=${encodeURIComponent(tag)}`}
                className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 transition hover:bg-teal-100"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{hobby.summary}</p>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 md:text-base">{hobby.detail}</p>

        <div className="mt-8">
          <HobbyPoster hobby={hobby} />
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-stone-100 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            いま注力していること
          </p>
          <p className="mt-2 text-base leading-7 text-slate-900">{hobby.currentFocus}</p>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">観測している指標</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {hobby.snapshot.map((metric) => (
              <div key={metric.label} className="rounded-[1.5rem] border border-slate-900/10 bg-stone-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{metric.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{metric.value}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{metric.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">深掘りテーブル</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                今の状態、気づき、次にやること
              </h3>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-600">
              感想だけで終わらず、次の試行につながる粒度で整理するための表です。
            </p>
          </div>
          <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-900/10">
            <table className="min-w-full divide-y divide-slate-900/10 text-left text-sm">
              <thead className="bg-stone-100 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">観点</th>
                  <th className="px-4 py-3 font-semibold">今の状態</th>
                  <th className="px-4 py-3 font-semibold">気づき</th>
                  <th className="px-4 py-3 font-semibold">次の一手</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/10 bg-white">
                {hobby.focusTable.map((row) => (
                  <tr key={row.theme} className="align-top">
                    <td className="px-4 py-4 font-semibold text-slate-950">{row.theme}</td>
                    <td className="px-4 py-4 text-slate-700">{row.current}</td>
                    <td className="px-4 py-4 text-slate-700">{row.signal}</td>
                    <td className="px-4 py-4 text-slate-700">{row.nextAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">組み合わせから生まれる案</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hobby.innovationIdeas.map((idea) => (
              <article key={idea.title} className="rounded-[1.5rem] border border-slate-900/10 bg-stone-50 p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{idea.combination}</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-950">{idea.title}</h4>
                <p className="mt-3 text-sm leading-6 text-slate-700">{idea.summary}</p>
              </article>
            ))}
          </div>
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

        {hobby.articles && hobby.articles.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">記事</p>
            <ul className="mt-4 space-y-3">
              {hobby.articles.map((article) => (
                <li key={article.slug}>
                  <Link
                    to={`/hobbies/${hobby.slug}/articles/${article.slug}`}
                    className="block rounded-[1.5rem] border border-slate-900/10 bg-stone-50 px-5 py-4 transition hover:bg-stone-200/60"
                  >
                    <p className="text-xs font-semibold text-slate-400">{article.date}</p>
                    <p className="mt-1 font-semibold text-slate-950">{article.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{article.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hobby.activityLog && hobby.activityLog.length > 0 && (
          <div className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">活動ログ</p>
            <ul className="mt-4 space-y-3">
              {hobby.activityLog.map((entry) => (
                <li key={`${entry.date}-${entry.title}`} className="rounded-[1.5rem] border border-slate-900/10 bg-stone-50 px-5 py-4">
                  <p className="text-xs font-semibold text-slate-400">{entry.date}</p>
                  <p className="mt-1 font-semibold text-slate-950">{entry.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>
                </li>
              ))}
            </ul>
          </div>
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
        <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">次に深掘りしたい切り口</p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-200">
            {hobby.draftAngles.map((angle) => (
              <li key={angle} className="rounded-2xl border border-white/10 px-3 py-3">
                {angle}
              </li>
            ))}
          </ul>
        </div>
        {categoryDef && (
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">カテゴリについて</p>
            <p className="mt-2 text-xs font-semibold text-teal-300">{categoryDef.label}</p>
            <p className="mt-1 text-sm leading-6 text-slate-300">{categoryDef.description}</p>
          </div>
        )}
        <Link
          to="/hobbies"
          className="mt-6 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        >
          一覧へ戻る
        </Link>
        <Link
          to={`/activity?hobby=${hobby.slug}`}
          className="mt-3 inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        >
          活動ログ一覧
        </Link>
        {relatedHobbies.length > 0 && (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              同じカテゴリの趣味
            </p>
            <ul className="mt-3 space-y-2">
              {relatedHobbies.map((related) => (
                <li key={related.slug}>
                  <Link
                    to={`/hobbies/${related.slug}`}
                    className="block rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 transition hover:border-white/30 hover:bg-white/5"
                  >
                    <span className="font-semibold text-white">{related.name}</span>
                    <span className="ml-2 text-slate-400">{related.cadence}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </section>
  );
}
