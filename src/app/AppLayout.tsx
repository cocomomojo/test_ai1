import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "ホーム" },
  { to: "/hobbies", label: "趣味一覧" }
];

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="rounded-[2rem] border border-slate-900/10 bg-white/85 px-6 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-700">
                Plan C Baseline
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                私の趣味を育てるサイト
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                小さく公開しながら、構造・運用・テストを育てていくための workspace。
              </p>
            </div>
            <nav className="flex gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-slate-950 text-white"
                        : "bg-slate-200/70 text-slate-700 hover:bg-slate-300"
                    ].join(" ")
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 py-8">
          <Outlet />
        </main>

        <footer className="flex flex-col gap-3 border-t border-slate-900/10 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>小さな公開と、改善サイクルを回し続けるための基盤をここから育てる。</span>
          <NavLink
            to="/report"
            className={({ isActive }) =>
              [
                "w-fit rounded-full px-3 py-1 text-xs font-medium transition",
                isActive
                  ? "bg-slate-950 text-white"
                  : "bg-slate-200/70 text-slate-600 hover:bg-slate-300"
              ].join(" ")
            }
          >
            E2E テストレポート
          </NavLink>
        </footer>
      </div>
    </div>
  );
}
