export default function PreviewA3({ form, paper, guide = true }) {
  const itemCount = Math.max(1, Number(form.itemCount) || 1);
  const columns = Math.min(4, Math.max(2, Number(form.columns) || 3));
  const rows = Math.ceil(itemCount / columns);
  const items = form.items
    ? form.items.split('\n').map((item) => item.trim()).filter(Boolean)
    : Array.from({ length: itemCount }, (_, index) => `Item ${index + 1}`);
  const paperWidth = form.orientation === 'Landscape' ? paper.height : paper.width;
  const paperHeight = form.orientation === 'Landscape' ? paper.width : paper.height;
  const aspectRatio = paperWidth / paperHeight;
  const headerPercent = clampPercent((Number(form.headerHeight) / paperHeight) * 100, 10, 20);
  const footerPercent = form.showFooter ? clampPercent((Number(form.footerHeight) / paperHeight) * 100, 6, 12) : 0;

  return (
    <div className="panel p-4">
      <p className="text-sm font-semibold text-slate-950">Live Preview</p>
      <p className="mt-1 text-xs text-slate-500">{paper.name} {form.orientation}</p>
      <div className="mt-4 overflow-auto rounded-xl bg-slate-100 p-4">
        <div
          className="relative mx-auto max-h-[680px] max-w-full bg-white shadow-soft"
          style={{
            aspectRatio,
            width: form.orientation === 'Landscape' ? '100%' : 'min(100%, 480px)',
          }}
        >
          {guide ? (
            <>
              <div className="pointer-events-none absolute inset-3 border border-dashed border-brand-500/70" />
              <div className="pointer-events-none absolute inset-5 border border-dashed border-slate-300/80" />
            </>
          ) : null}
          <div className="relative z-10 flex h-full min-h-0 flex-col p-5">
            <header className="min-h-0 border-b border-slate-200 pb-2" style={{ flexBasis: `${headerPercent}%` }}>
              <p className="truncate text-[10px] font-bold uppercase text-brand-700">{form.brand || 'Brand Name'}</p>
              <h3 className="mt-1 truncate text-base font-extrabold leading-tight text-slate-950 sm:text-xl">{form.title || 'Main Title'}</h3>
              <p className="mt-0.5 truncate text-[10px] text-slate-500 sm:text-xs">{form.subtitle || 'Subtitle information'}</p>
            </header>
            <div
              className="grid min-h-0 flex-1 gap-2 overflow-hidden py-3"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gap: `${Math.max(4, Number(form.gutter) * 8)}px`,
              }}
            >
              {Array.from({ length: itemCount }).map((_, index) => (
                <ItemCard
                  key={index}
                  name={items[index] || `Item ${index + 1}`}
                  showPrice={form.showPrice}
                  showDescription={form.showDescription}
                />
              ))}
            </div>
            {form.showFooter ? (
              <footer
                className="min-h-0 overflow-hidden border-t border-slate-200 pt-2 text-center text-[10px] text-slate-500"
                style={{ flexBasis: `${footerPercent}%` }}
              >
                <p className="truncate">{form.footerInfo || 'Footer info / kontak / alamat'}</p>
              </footer>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemCard({ name, showPrice, showDescription }) {
  return (
    <div className="flex min-h-0 flex-col rounded-md border border-slate-200 bg-slate-50 p-1.5">
      <div className="min-h-0 flex-1 rounded border border-dashed border-slate-300 bg-white" />
      <p className="mt-1 truncate text-[10px] font-bold leading-tight text-slate-800">{name}</p>
      {showPrice ? <p className="truncate text-[9px] font-semibold leading-tight text-brand-700">Rp 00.000</p> : null}
      {showDescription ? (
        <p
          className="mt-0.5 overflow-hidden text-[8px] leading-tight text-slate-500"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          Deskripsi singkat item
        </p>
      ) : null}
    </div>
  );
}

function clampPercent(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
