export default function PreviewBusinessCard({ form, guide = true }) {
  const width = Math.max(1, Number(form.width) || 9);
  const height = Math.max(1, Number(form.height) || 5.5);
  const aspect = form.orientation === 'Portrait' ? height / width : width / height;
  const front = (
    <CardSurface title="Front Side" aspect={aspect} guide={guide}>
      <FrontContent form={form} />
    </CardSurface>
  );

  return (
    <div className="panel p-4">
      <p className="text-sm font-semibold text-slate-950">Live Preview</p>
      <p className="mt-1 text-xs text-slate-500">{form.width} x {form.height} {form.unit} · {form.orientation}</p>
      <div className="mt-4 space-y-4 rounded-xl bg-slate-100 p-4">
        {front}
        {form.sideMode === '2 Sisi' ? <CardSurface title="Back Side" aspect={aspect} guide={guide}><BackContent form={form} /></CardSurface> : null}
      </div>
      <p className="mt-3 text-xs text-slate-500">Preview menggunakan skala visual, bukan ukuran cetak asli.</p>
    </div>
  );
}

function CardSurface({ title, aspect, guide, children }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-slate-500">{title}</p>
      <div
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-xl border bg-white shadow-soft"
        style={{ aspectRatio: aspect, borderColor: guide ? '#fca5a5' : '#d6dbe5' }}
      >
        {guide ? (
          <>
            <div className="pointer-events-none absolute inset-0 rounded-xl border border-red-300" />
            <div className="pointer-events-none absolute inset-3 rounded-lg border border-dashed border-amber-300/80" />
            <div className="pointer-events-none absolute inset-6 rounded-md border border-dashed border-brand-500/70" />
          </>
        ) : null}
        <div className="absolute inset-6 z-10 min-w-0 overflow-hidden">{children}</div>
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
          <p className="truncate text-[10px] font-bold uppercase text-brand-700">{form.logoText || form.company || 'Logo / Brand'}</p>
          <h3 className="mt-2 truncate text-xl font-extrabold leading-tight text-slate-950">{form.name || 'Nama Lengkap'}</h3>
          <p className="truncate text-xs font-medium text-slate-500">{form.jobTitle || 'Jabatan'}</p>
          <p className="mt-1 truncate text-xs font-semibold text-slate-700">{form.company || 'Nama Brand / Perusahaan'}</p>
          {form.tagline ? <p className="mt-2 max-w-full truncate text-[10px] text-slate-500">{form.tagline}</p> : null}
        </div>
        {form.qr ? <QrBox /> : null}
      </div>
      <div className="min-w-0 border-t border-slate-200 pt-2">
        <div className="grid gap-1 text-[10px] font-medium text-slate-600 sm:grid-cols-2">
          {contact.length ? contact.slice(0, 4).map((item) => <p key={item} className="truncate">{item}</p>) : <p className="truncate">Phone / Email / Website</p>}
        </div>
        {form.address ? <p className="mt-1 truncate text-[10px] text-slate-500">{form.address}</p> : null}
      </div>
    </div>
  );
}

function BackContent({ form }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="rounded-xl border border-dashed border-slate-300 px-6 py-4">
        <p className="text-lg font-extrabold text-slate-950">{form.logoText || form.company || 'Brand'}</p>
        {form.tagline ? <p className="mt-1 text-xs text-slate-500">{form.tagline}</p> : null}
      </div>
      <div className="mt-5 h-8 w-36 rounded-full bg-brand-50" />
    </div>
  );
}

function QrBox() {
  return (
    <div className="grid h-14 w-14 shrink-0 grid-cols-3 gap-0.5 rounded bg-slate-900 p-1.5">
      {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? 'bg-white' : 'bg-slate-900'} />)}
    </div>
  );
}
