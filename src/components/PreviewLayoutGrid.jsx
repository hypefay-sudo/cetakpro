export default function PreviewLayoutGrid({ result, shape, guide = true }) {
  const paperRatio = result.paperWidth && result.paperHeight ? result.paperWidth / result.paperHeight : 0.66;
  const columns = Math.min(result.columns || 0, 16);
  const rows = Math.min(result.rows || 0, 18);
  const rounded = shape === 'Bulat' || shape === 'Oval' ? 'rounded-full' : shape === 'Rounded Corner' ? 'rounded-md' : 'rounded-sm';

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Preview Layout</p>
          <p className="text-xs text-slate-500">Guide {guide ? 'On' : 'Off'}</p>
        </div>
      </div>
      <div className="rounded-xl bg-slate-100 p-4">
        <div
          className="relative mx-auto max-h-[620px] max-w-full overflow-hidden bg-white shadow-soft"
          style={{ aspectRatio: paperRatio, width: paperRatio > 1 ? '100%' : 'min(100%, 420px)' }}
        >
          {guide ? <div className="absolute inset-0 border-2 border-red-400" /> : null}
          <div
            className="absolute border border-dashed border-brand-500 bg-brand-50/40"
            style={{
              left: `${(result.margins.left / result.paperWidth) * 100}%`,
              right: `${(result.margins.right / result.paperWidth) * 100}%`,
              top: `${(result.margins.top / result.paperHeight) * 100}%`,
              bottom: `${(result.margins.bottom / result.paperHeight) * 100}%`,
            }}
          >
            {result.total > 0 ? (
              <div
                className="grid h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gap: 4,
                  padding: 6,
                }}
              >
                {Array.from({ length: columns * rows }).map((_, index) => (
                  <div key={index} className={`border border-slate-300 bg-white/90 ${rounded}`} />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm font-medium text-slate-500">
                Desain belum muat di area efektif
              </div>
            )}
          </div>
          {guide ? (
            <>
              <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-red-600">
                Final Size
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-brand-700">
                {result.effectiveWidth?.toFixed(1)} x {result.effectiveHeight?.toFixed(1)} cm
              </span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
