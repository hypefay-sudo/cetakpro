export default function ReviewTextBox({ fields, warnings = [], items, itemLabel = 'Item names', labelWidth = '112px' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-sm font-bold text-slate-950">Review Teks</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">
        Pastikan teks sudah benar. Sistem akan memakai teks persis seperti yang Anda tulis.
      </p>
      <div className="mt-3 space-y-1.5 text-sm">
        {fields.map(([label, value]) => (
          <div key={label} className="grid gap-2" style={{ gridTemplateColumns: `${labelWidth} minmax(0, 1fr)` }}>
            <span className="text-xs font-semibold uppercase text-slate-500">{label}</span>
            <span className={`min-w-0 break-words ${String(value || '').trim() ? 'text-slate-800' : 'text-slate-400'}`}>
              {String(value || '').trim() || 'Belum diisi'}
            </span>
          </div>
        ))}
        {items ? (
          <div className="grid gap-2" style={{ gridTemplateColumns: `${labelWidth} minmax(0, 1fr)` }}>
            <span className="text-xs font-semibold uppercase text-slate-500">{itemLabel}</span>
            <div className={`min-w-0 space-y-1 ${items.length ? 'text-slate-800' : 'text-slate-400'}`}>
              {items.length ? items.slice(0, 8).map((item, index) => <p key={`${item}-${index}`} className="break-words">{item}</p>) : 'Belum diisi'}
              {items.length > 8 ? <p className="text-xs text-slate-500">+{items.length - 8} item lainnya</p> : null}
            </div>
          </div>
        ) : null}
      </div>
      {warnings.length ? (
        <div className="mt-3 space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {warnings.map((warning) => <p key={warning}>{warning}</p>)}
        </div>
      ) : null}
    </div>
  );
}
