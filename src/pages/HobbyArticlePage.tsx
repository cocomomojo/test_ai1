import { Link, useParams } from "react-router-dom";

import { getArticleBySlug, getHobbyBySlug } from "../content/hobbies";
import type { ArticleSection } from "../content/schema";

function SectionBlock({ section }: { section: ArticleSection }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold tracking-tight text-slate-950">{section.heading}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-700">{section.body}</p>
      {section.table && (
        <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-slate-900/10">
          <table className="min-w-full divide-y divide-slate-900/10 text-left text-sm">
            <thead className="bg-stone-100 text-slate-600">
              <tr>
                {section.table.headers.map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/10 bg-white">
              {section.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 ${cellIndex === 0 ? "font-semibold text-slate-950" : "text-slate-700"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function HobbyArticlePage() {
  const { slug = "", articleSlug = "" } = useParams();
  const hobby = getHobbyBySlug(slug);
  const article = getArticleBySlug(slug, articleSlug);

  if (!hobby || !article) {
    return (
      <section className="rounded-[2rem] border border-rose-200 bg-white px-8 py-10">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">未登録</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-950">この記事はまだ用意されていません。</h2>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
          コンテンツ構造は拡張できるようにしてありますが、この記事はまだ登録されていません。
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
    <section className="grid gap-6 lg:grid-cols-[1fr_auto]">
      <article className="rounded-[2rem] bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.name}</span>
          <span className="rounded-full bg-stone-100 px-3 py-1">{hobby.category}</span>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-teal-700">記事</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{article.title}</h2>
        <p className="mt-1 text-xs text-slate-400">{article.date}</p>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{article.summary}</p>

        <div className="mt-2 border-t border-slate-900/10 pt-2">
          {article.sections.map((section) => (
            <SectionBlock key={section.heading} section={section} />
          ))}
        </div>

        {hobby.updatedAt && (
          <p className="mt-8 text-xs text-slate-400">更新: {hobby.updatedAt}</p>
        )}
      </article>

      <aside className="lg:w-60">
        <div className="rounded-[2rem] border border-slate-900/10 bg-slate-950 px-6 py-8 text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-teal-300">この趣味の記事</p>
          <ul className="mt-4 space-y-2 text-sm">
            {(hobby.articles ?? []).map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/hobbies/${hobby.slug}/articles/${a.slug}`}
                  className={`block rounded-2xl px-3 py-2 transition ${
                    a.slug === articleSlug
                      ? "bg-white/15 font-semibold text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-2">
            <Link
              to={`/hobbies/${hobby.slug}`}
              className="block rounded-full border border-white/20 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-white/40"
            >
              趣味の詳細へ
            </Link>
            <Link
              to="/hobbies"
              className="block rounded-full border border-white/20 px-4 py-2 text-center text-sm font-semibold text-white transition hover:border-white/40"
            >
              一覧へ戻る
            </Link>
          </div>
        </div>
      </aside>
    </section>
  );
}
