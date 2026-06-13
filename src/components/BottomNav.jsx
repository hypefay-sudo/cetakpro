import { NavLink } from 'react-router-dom';

const items = [
  { label: 'Home', path: '/' },
  { label: 'Layout', path: '/layout' },
  { label: 'Generate', path: '/generate/banner' },
  { label: 'History', path: '/history' },
  { label: 'Settings', path: '/settings' },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white px-1 pb-2 pt-1 lg:hidden">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `rounded-lg px-1 py-2 text-center text-[11px] font-semibold ${
              isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-500'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
