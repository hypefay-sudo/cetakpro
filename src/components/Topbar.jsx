import { Link } from 'react-router-dom';

export default function Topbar({ plan = 'FREE' }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="block lg:hidden">
          <span className="text-lg font-bold text-slate-950">CetakPro</span>
        </Link>
        <div className="hidden min-w-0 flex-1 sm:block">
          <label className="sr-only" htmlFor="topbar-search">
            Search
          </label>
          <input
            id="topbar-search"
            className="field max-w-md"
            placeholder="Cari prompt, preset, atau fitur..."
            type="search"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{plan}</span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            User
          </span>
        </div>
      </div>
    </header>
  );
}
