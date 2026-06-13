export default function LicenseGate({ isPro, usage, children }) {
  const remaining = Math.max(0, 10 - (usage?.count || 0));
  return (
    <div className="space-y-4">
      {!isPro ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Mode FREE aktif. Sisa generate hari ini: <strong>{remaining}</strong>.
        </div>
      ) : null}
      {children}
    </div>
  );
}
