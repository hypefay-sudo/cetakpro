import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Dashboard', path: '/' },
  { label: 'Layout Master', path: '/layout' },
  { label: 'Banner / Spanduk', path: '/generate/banner' },
  { label: 'Stiker / Label', path: '/generate/stiker-label' },
  { label: 'A3 Custom', path: '/generate/a3-custom' },
  { label: 'Preset', disabled: true },
  { label: 'History', path: '/history' },
  { label: 'License', path: '/license' },
  { label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-navy-950 text-white lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="text-2xl font-bold tracking-tight">CetakPro</div>
        <p className="mt-1 text-sm text-slate-300">Layout Calculator & Print Prompt Generator</p>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-5">
        {items.map((item) =>
          item.disabled ? (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-500"
            >
              <span>{item.label}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase">Soon</span>
            </div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-brand-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ),
        )}
      </nav>
      <div className="border-t border-white/10 px-6 py-5 text-xs text-slate-400">
        © 2026 CetakPro. All rights reserved.
      </div>
    </aside>
  );
}
