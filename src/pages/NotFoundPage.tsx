import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
      <section className="rounded-[2rem] bg-white px-8 py-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
          The route could not be resolved. Go back to the homepage and continue the next cycle.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Return home
        </Link>
      </section>
    </div>
  );
}
