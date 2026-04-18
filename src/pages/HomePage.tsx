import { Link } from "react-router-dom";

import { hobbies } from "../content/hobbies";

export function HomePage() {
  return (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[2rem] bg-slate-950 px-8 py-10 text-stone-50 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
          <p className="text-sm uppercase tracking-[0.35em] text-teal-300">初回リリース</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            私の趣味を、続けやすい形で少しずつ残していく。
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            このサイトでは、ランニング、コーヒー、小さな制作を中心に、あとから見返しやすい
            メモを積み上げていきます。最初はトップ、一覧、詳細の導線だけに絞り、改善しながら
            伸ばしていく前提です。
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
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">収録中の趣味</p>
            <p className="mt-3 text-4xl font-semibold text-slate-950">{hobbies.length}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              コンテンツは Zod で検証しているため、次の追加や変更も崩れにくい構造です。
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-slate-900/10 bg-white p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">今回の方針</p>
            <p className="mt-3 text-lg font-semibold text-slate-950">まずは公開できる導線を整える</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              初回は情報量よりも、見つけやすさと更新しやすさを優先して積み上げます。
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-900/10 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">初回に載せる内容</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              まずはこの3つの趣味から始める
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            各ページには、今続けていること、最初に載せたい内容、次に広げたい方向を入れていく。
          </p>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {hobbies.map((hobby) => (
            <article key={hobby.slug} className="rounded-[1.5rem] bg-stone-100 p-5">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-lg font-semibold text-slate-950">{hobby.name}</h4>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  {hobby.cadence}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{hobby.summary}</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                いま注力していること
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-800">{hobby.currentFocus}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
