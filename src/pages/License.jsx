import { useState } from 'react';
import { clearLicenseCache, getCachedPlan } from '../license/licenseUtils';
import { validateLicense } from '../license/validateLicense';

export default function License({ license, onLicenseChange, showToast }) {
  const [key, setKey] = useState(license.licenseKey || '');
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(getCachedPlan());

  const activate = async () => {
    setLoading(true);
    try {
      const result = await validateLicense(key);
      onLicenseChange?.(result);
      setCurrent(getCachedPlan());
      showToast?.(result.message || (result.valid ? 'License aktif.' : 'License tidak valid.'));
    } catch {
      clearLicenseCache();
      onLicenseChange?.({ valid: false, plan: 'FREE' });
      setCurrent({ isPro: false, plan: 'FREE', expiresAt: null, licenseKey: '' });
      showToast?.('License gagal divalidasi.');
    } finally {
      setLoading(false);
    }
  };

  const deactivate = () => {
    clearLicenseCache();
    onLicenseChange?.({ valid: false, plan: 'FREE' });
    setCurrent({ isPro: false, plan: 'FREE', expiresAt: null, licenseKey: '' });
    setKey('');
    showToast?.('License cache dibersihkan. Plan kembali FREE.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">License</h1>
        <p className="mt-1 text-slate-600">Aktifkan PRO jika license tersedia. Tanpa env Supabase, aplikasi tetap berjalan dalam FREE mode.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="panel p-5">
          <label>
            <span className="field-label">License key</span>
            <input className="field" value={key} onChange={(event) => setKey(event.target.value)} placeholder="Masukkan license key" />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="btn-primary" type="button" disabled={loading} onClick={activate}>{loading ? 'Validating...' : 'Activate'}</button>
            <button className="btn-secondary" type="button" onClick={deactivate}>Clear license cache</button>
          </div>
        </section>
        <aside className="panel p-5">
          <p className="text-sm font-semibold text-slate-500">Current plan</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">{current.isPro ? current.plan : 'FREE'}</p>
          <p className="mt-2 text-sm text-slate-500">
            Expiry date: {current.expiresAt ? new Date(current.expiresAt).toLocaleString('id-ID') : '-'}
          </p>
        </aside>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        <PlanCard title="FREE" items={['Generate limit 10 per day', 'History max 5', 'Basic presets only', 'Export TXT allowed']} />
        <PlanCard title="PRO" accent items={['Unlimited generate', 'Full history', 'All prompt sections', 'Production prompt detail', 'All presets', 'Future premium templates']} />
      </section>
    </div>
  );
}

function PlanCard({ title, items, accent }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <p className="text-lg font-bold text-slate-950">{title}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-600">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}
