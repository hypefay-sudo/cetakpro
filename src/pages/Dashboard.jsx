import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { getHistory, getDailyUsage } from '../utils/storage';

const actions = [
  { title: 'Layout Master', description: 'Hitung muatan desain dalam satu lembar cetak.', path: '/layout' },
  { title: 'Banner / Spanduk', description: 'Prompt produksi untuk banner dan spanduk.', path: '/generate/banner' },
  { title: 'Stiker / Label', description: 'Prompt label kemasan lengkap dengan cutline.', path: '/generate/stiker-label' },
  { title: 'A3 Custom', description: 'Grid katalog, menu, price list, dan promo sheet.', path: '/generate/a3-custom' },
];

const newPrintProducts = [
  { title: 'Kartu Nama', description: 'Prompt kartu nama print-ready, 1 sisi atau 2 sisi.', path: '/generate/kartu-nama' },
];

const displayCategory = (category) => (category === 'Sticker' ? 'Stiker / Label' : category);

export default function Dashboard({ license }) {
  const history = getHistory();
  const usage = getDailyUsage();
  const today = new Date().toISOString().slice(0, 10);
  const todayPrompts = history.filter((item) => item.createdAt?.startsWith(today)).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-brand-700">CetakPro</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl">Selamat datang di CetakPro</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Hitung layout cetak dan buat prompt desain siap produksi.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Prompt" value={history.length} hint="Semua kategori" />
        <StatCard label="History Tersimpan" value={history.length} hint={license.isPro ? 'Full history' : 'Maks. 5 di FREE'} />
        <StatCard label="Plan Aktif" value={license.plan} hint={license.expiresAt ? `Exp ${new Date(license.expiresAt).toLocaleDateString('id-ID')}` : 'Soft limit aktif'} />
        <StatCard label="Prompt Hari Ini" value={Math.max(todayPrompts, usage.count)} hint="Generate counter" />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.path} to={action.path} className="panel block p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
            <p className="text-base font-bold text-slate-950">{action.title}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
          </Link>
        ))}
      </section>

      <section className="panel p-5">
        <h2 className="text-base font-bold text-slate-950">Produk Cetak Baru</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {newPrintProducts.map((action) => (
            <Link key={action.path} to={action.path} className="block rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-white hover:shadow-sm">
              <p className="text-sm font-bold text-slate-950">{action.title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-950">Latest History</h2>
          <Link className="text-sm font-semibold text-brand-700" to="/history">
            Lihat semua
          </Link>
        </div>
        {history.length ? (
          <div className="divide-y divide-slate-100">
            {history.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{displayCategory(item.category)} - {new Date(item.createdAt).toLocaleString('id-ID')}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{item.platform}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="History masih kosong" description="Prompt yang disimpan akan muncul di dashboard." />
        )}
      </section>
    </div>
  );
}
