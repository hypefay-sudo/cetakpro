import { cacheLicense, clearLicenseCache, getDeviceId } from './licenseUtils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const isValidRecord = (license) => {
  if (!license) return false;
  const status = String(license.status || '').toLowerCase();
  if (['revoked', 'deleted', 'expired'].includes(status)) return false;
  if (status !== 'active') return false;
  if (!license.expires_at) return false;
  return new Date(license.expires_at).getTime() > Date.now();
};

const validateViaSupabase = async (licenseKey) => {
  const url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/licenses?license_key=eq.${encodeURIComponent(
    licenseKey,
  )}&select=*`;
  const response = await fetch(url, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  });
  if (!response.ok) throw new Error('License service unavailable');
  const [license] = await response.json();
  if (!isValidRecord(license)) {
    clearLicenseCache();
    return { valid: false, plan: 'FREE', message: 'License tidak valid atau sudah kedaluwarsa.' };
  }
  const deviceId = getDeviceId();
  if (license.device_id && license.device_id !== deviceId) {
    clearLicenseCache();
    return { valid: false, plan: 'FREE', message: 'License sudah digunakan di perangkat lain.' };
  }
  cacheLicense(license);
  return {
    valid: true,
    plan: license.plan || 'PRO',
    expiresAt: license.expires_at,
    license,
    message: 'License aktif.',
  };
};

const validateDemo = (licenseKey) => {
  if (licenseKey !== 'DEMO-PRO') {
    clearLicenseCache();
    return { valid: false, plan: 'FREE', message: 'License tidak valid.' };
  }
  // Demo mode is available only when Supabase keys are absent, for local testing.
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const license = {
    id: 'demo',
    license_key: 'DEMO-PRO',
    plan: 'PRO',
    status: 'active',
    expires_at: expires,
    device_id: getDeviceId(),
  };
  cacheLicense(license);
  return { valid: true, plan: 'PRO', expiresAt: expires, license, message: 'License aktif.' };
};

export const validateLicense = async (licenseKey) => {
  if (!licenseKey) {
    clearLicenseCache();
    return { valid: false, plan: 'FREE', message: 'Masukkan license key.' };
  }
  return isConfigured ? validateViaSupabase(licenseKey.trim()) : validateDemo(licenseKey.trim());
};

export const validateStoredLicense = async () => {
  const licenseKey = localStorage.getItem('licenseKey');
  if (!licenseKey) {
    clearLicenseCache();
    return { valid: false, plan: 'FREE' };
  }
  return validateLicense(licenseKey);
};
