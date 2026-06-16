export default function PreviewBusinessCard({ form, guide = true }) {
  const width = Math.max(1, Number(form.width) || 9);
  const height = Math.max(1, Number(form.height) || 5.5);
  const cardWidth = form.orientation === 'Portrait' ? height : width;
  const cardHeight = form.orientation === 'Portrait' ? width : height;
  const aspect = cardWidth / cardHeight;
  const isTwoSided = form.sideMode === 'Dua Sisi';

  return (
    <div className="panel min-w-0 p-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-950">Live Preview</p>
          <p className="mt-1 text-xs text-slate-500">{form.width} x {form.height} {form.unit} - {form.orientation}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{form.sideMode}</span>
      </div>
      <div className={`mt-4 grid min-w-0 gap-4 rounded-xl bg-slate-50 p-3 sm:p-4 ${isTwoSided ? 'lg:grid-cols-2' : ''}`}>
        <CardSurface title="Sisi Depan" aspect={aspect} guide={guide}>
          <FrontContent form={form} />
        </CardSurface>
        {isTwoSided ? (
          <CardSurface title="Sisi Belakang" aspect={aspect} guide={guide}>
            <BackContent form={form} />
          </CardSurface>
        ) : null}
      </div>
      <p className="mt-3 text-xs text-slate-500">Preview menggunakan skala visual, bukan ukuran cetak asli.</p>
    </div>
  );
}

function CardSurface({ title, aspect, guide, children }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{title}</p>
      <div
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-lg border bg-white shadow-sm"
        style={{ aspectRatio: aspect, borderColor: guide ? '#f1b9b9' : '#d6dbe5' }}
      >
        {guide ? (
          <>
            <div className="pointer-events-none absolute inset-0 z-0 rounded-lg border border-red-300/60" />
            <div className="pointer-events-none absolute inset-3 z-0 rounded-md border border-dashed border-amber-300/70" />
            <div className="pointer-events-none absolute inset-5 z-0 rounded border border-dashed border-brand-500/45 sm:inset-6" />
          </>
        ) : null}
        <div className="absolute inset-5 z-10 min-w-0 overflow-hidden sm:inset-6">{children}</div>
      </div>
    </div>
  );
}

function FrontContent({ form }) {
  const contact = [form.phone, form.email, form.website, form.instagram].map((value) => String(value || '').trim()).filter(Boolean);
  return (
    <div className="flex h-full min-h-0 flex-col justify-between gap-3">
      <div className="flex min-h-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[10px] font-bold uppercase text-brand-700">{form.company || 'Nama Brand / Perusahaan'}</p>
          <h3 className="mt-2 truncate text-lg font-extrabold leading-tight text-slate-950 sm:text-xl">{form.name || 'Nama Orang'}</h3>
          <p className="truncate text-xs font-medium text-slate-500">{form.jobTitle || 'Jabatan'}</p>
          {form.tagline ? <p className="mt-2 max-w-full truncate text-[10px] font-semibold text-slate-600">{form.tagline}</p> : null}
        </div>
        {form.qr ? <QrBox /> : null}
      </div>
      <div className="min-w-0 border-t border-slate-200 pt-2">
        <div className="grid gap-1 text-[10px] font-medium text-slate-600 sm:grid-cols-2">
          {contact.length ? contact.slice(0, 4).map((item) => <p key={item} className="truncate">{item}</p>) : <p className="truncate">WhatsApp / Email / Website</p>}
        </div>
        {form.address ? <p className="mt-1 truncate text-[10px] text-slate-500">{form.address}</p> : null}
      </div>
    </div>
  );
}

function BackContent({ form }) {
  const secondary = [form.website, form.instagram].map((value) => String(value || '').trim()).filter(Boolean);
  return (
    <div className="flex h-full min-h-0 items-center justify-between gap-5">
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-xl font-extrabold text-slate-950 sm:text-2xl">{form.company || 'Brand / Perusahaan'}</p>
        {form.tagline ? <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-500">{form.tagline}</p> : null}
        {secondary.length ? (
          <div className="mt-4 space-y-1 text-[10px] font-medium text-slate-600">
            {secondary.map((item) => <p key={item} className="truncate">{item}</p>)}
          </div>
        ) : null}
      </div>
      {form.qr ? <QrBox large /> : null}
    </div>
  );
}

function QrBox({ large = false }) {
  return (
    <div className={`${large ? 'h-20 w-20' : 'h-14 w-14'} grid shrink-0 grid-cols-3 gap-0.5 rounded bg-slate-900 p-1.5`}>
      {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? 'bg-white' : 'bg-slate-900'} />)}
    </div>
  );
}
