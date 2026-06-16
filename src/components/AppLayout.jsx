import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import { validateStoredLicense } from '../license/validateLicense';

export default function AppLayout({ plan, onLicenseChange }) {
  const location = useLocation();
  const isGeneratorPage = location.pathname.startsWith('/generate/');

  useEffect(() => {
    validateStoredLicense().then((result) => {
      onLicenseChange?.(result);
    });
  }, [location.pathname, onLicenseChange]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="min-w-0 lg:pl-72">
        <Topbar plan={plan} />
        {isGeneratorPage ? <MobileGeneratorNav /> : null}
        <main className="min-h-[calc(100vh-64px)] px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

const generatorItems = [
  { label: 'Banner / Spanduk', path: '/generate/banner' },
  { label: 'Stiker / Label', path: '/generate/stiker-label' },
  { label: 'A3 Custom', path: '/generate/a3-custom' },
  { label: 'Kartu Nama', path: '/generate/kartu-nama' },
];

function MobileGeneratorNav() {
  return (
    <nav className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto">
        {generatorItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                isActive ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
