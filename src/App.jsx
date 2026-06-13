import { useCallback, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import LayoutMaster from './pages/LayoutMaster';
import GenerateBanner from './pages/GenerateBanner';
import GenerateStickerLabel from './pages/GenerateStickerLabel';
import GenerateA3Custom from './pages/GenerateA3Custom';
import History from './pages/History';
import Settings from './pages/Settings';
import License from './pages/License';
import { getCachedPlan } from './license/licenseUtils';
import { getDailyUsage } from './utils/storage';

export default function App() {
  const [license, setLicense] = useState(getCachedPlan());
  const [usage, setUsage] = useState(getDailyUsage());
  const [toast, setToast] = useState('');

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(window.__cetakproToast);
    window.__cetakproToast = window.setTimeout(() => setToast(''), 2600);
  }, []);

  const updateLicense = useCallback((result) => {
    if (result?.valid) {
      setLicense({ isPro: true, plan: result.plan || 'PRO', expiresAt: result.expiresAt, licenseKey: result.license?.license_key });
    } else {
      setLicense({ isPro: false, plan: 'FREE', expiresAt: null, licenseKey: '' });
    }
  }, []);

  const appContext = {
    license,
    usage,
    setUsage,
    showToast,
  };

  return (
    <>
      <Routes>
        <Route element={<AppLayout plan={license.plan} onLicenseChange={updateLicense} />}>
          <Route index element={<Dashboard {...appContext} />} />
          <Route path="/layout" element={<LayoutMaster {...appContext} />} />
          <Route path="/generate/banner" element={<GenerateBanner {...appContext} />} />
          <Route path="/generate/stiker-label" element={<GenerateStickerLabel {...appContext} />} />
          <Route path="/generate/a3-custom" element={<GenerateA3Custom {...appContext} />} />
          <Route path="/history" element={<History {...appContext} />} />
          <Route path="/settings" element={<Settings {...appContext} />} />
          <Route path="/license" element={<License {...appContext} onLicenseChange={updateLicense} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      {toast ? (
        <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-soft lg:bottom-6">
          {toast}
        </div>
      ) : null}
    </>
  );
}
