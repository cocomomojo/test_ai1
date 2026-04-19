import type { Hobby } from "../content/schema";

const visualThemes = {
  running: {
    panel: "bg-gradient-to-br from-slate-950 via-sky-900 to-teal-600 text-white",
    glow: "bg-teal-300/35",
    chip: "border-white/15 bg-white/10 text-white/90"
  },
  coffee: {
    panel: "bg-gradient-to-br from-stone-950 via-amber-900 to-orange-500 text-white",
    glow: "bg-amber-300/35",
    chip: "border-white/15 bg-white/10 text-white/90"
  },
  making: {
    panel: "bg-gradient-to-br from-slate-950 via-cyan-800 to-emerald-500 text-white",
    glow: "bg-cyan-300/35",
    chip: "border-white/15 bg-white/10 text-white/90"
  },
  diy: {
    panel: "bg-gradient-to-br from-zinc-950 via-orange-800 to-amber-500 text-white",
    glow: "bg-orange-300/35",
    chip: "border-white/15 bg-white/10 text-white/90"
  },
  curry: {
    panel: "bg-gradient-to-br from-red-950 via-orange-700 to-amber-400 text-white",
    glow: "bg-amber-200/40",
    chip: "border-white/15 bg-white/10 text-white/90"
  },
  devops: {
    panel: "bg-gradient-to-br from-slate-950 via-indigo-900 to-cyan-500 text-white",
    glow: "bg-cyan-200/35",
    chip: "border-white/15 bg-white/10 text-white/90"
  }
} satisfies Record<string, { panel: string; glow: string; chip: string }>;

type VisualThemeKey = keyof typeof visualThemes;

const barHeights = ["h-14", "h-24", "h-16", "h-28"];

function hasVisualTheme(slug: string): slug is VisualThemeKey {
  return slug in visualThemes;
}

export function HobbyPoster({ hobby }: { hobby: Hobby }) {
  const theme = hasVisualTheme(hobby.slug) ? visualThemes[hobby.slug] : visualThemes.making;

  return (
    <div
      role="img"
      aria-label={`${hobby.name} のイメージボード`}
      className={`relative overflow-hidden rounded-[2rem] p-6 shadow-[0_30px_70px_rgba(15,23,42,0.18)] ${theme.panel}`}
    >
      <div aria-hidden className={`absolute -left-12 top-6 h-36 w-36 rounded-full blur-3xl ${theme.glow}`} />
      <div aria-hidden className="absolute right-6 top-6 h-20 w-20 rounded-full border border-white/15 bg-white/10" />
      <div aria-hidden className="absolute bottom-4 right-4 flex items-end gap-2 opacity-80">
        {hobby.focusTable.slice(0, 4).map((row, index) => (
          <span
            key={row.theme}
            className={`w-4 rounded-full bg-white/35 ${barHeights[index % barHeights.length]}`}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">{hobby.category}</p>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-3xl font-semibold tracking-tight md:text-[2rem]">{hobby.name}</p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">{hobby.summary}</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
              {hobby.cadence}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {hobby.snapshot.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.25rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65">{metric.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-white">{metric.value}</p>
              <p className="mt-2 text-xs leading-5 text-white/70">{metric.note}</p>
            </div>
          ))}
        </div>

        {hobby.tags && hobby.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hobby.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className={`rounded-full border px-3 py-1 text-xs font-medium ${theme.chip}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}