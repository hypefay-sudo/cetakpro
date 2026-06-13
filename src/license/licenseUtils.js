export const LICENSE_KEYS = [
  'licenseKey',
  'licensePlan',
  'licenseExpiresAt',
  'isPro',
  'proAccess',
  'userLicense',
];

export const clearLicenseCache = () => {
  LICENSE_KEYS.forEach((key) => localStorage.removeItem(key));
};

export const getDeviceId = () => {
  const existing = localStorage.getItem('cetakpro.deviceId');
  if (existing) return existing;
  const id = `device-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;
  localStorage.setItem('cetakpro.deviceId', id);
  return id;
};

export const cacheLicense = (license) => {
  localStorage.setItem('licenseKey', license.license_key);
  localStorage.setItem('licensePlan', license.plan || 'PRO');
  localStorage.setItem('licenseExpiresAt', license.expires_at || '');
  localStorage.setItem('isPro', 'true');
  localStorage.setItem('proAccess', 'true');
  localStorage.setItem('userLicense', JSON.stringify(license));
};

export const getCachedPlan = () => ({
  isPro: localStorage.getItem('isPro') === 'true',
  plan: localStorage.getItem('licensePlan') || 'FREE',
  expiresAt: localStorage.getItem('licenseExpiresAt') || null,
  licenseKey: localStorage.getItem('licenseKey') || '',
});
