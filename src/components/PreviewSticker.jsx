export default function PreviewSticker({ form }) {
  const width = Math.max(1, Number(form.width) || 1);
  const height = Math.max(1, Number(form.height) || 1);
  const ratio = width / height;
  const wide = ratio > 1.8 || form.shape === 'Bottle Wrap';
  const compact = ratio < 0.8 || form.shape === 'Bulat';
  const shapeClass = getShapeClass(form.shape);
  const brand = form.brand || 'Brand';
  const product = form.productName || 'Product Name';
  const variant = form.variant || 'Variant';
  const description = form.description || 'Short product description';
  const weight = form.weight || '100 g';
  const legalText = form.legalInfo || (form.legal ? 'Legal info area' : '');
  const expiredText = form.expiredDateText || (form.expired ? 'EXP: DD/MM/YYYY' : '');

  return (
    <div className="panel p-4">
      <p className="text-sm font-semibold text-slate-950">Live Preview</p>
      <p className="mt-1 text-xs text-slate-500">{form.width} x {form.height} {form.unit}</p>
      <div className="mt-4 flex min-h-[430px] items-center justify-center rounded-xl bg-slate-100 p-5">
        <div className={`relative w-full ${wide ? 'max-w-xl' : 'max-w-sm'} overflow-hidden border border-dashed border-red-400 bg-white shadow-soft ${shapeClass}`} style={{ aspectRatio: getPreviewAspect(form.shape, ratio) }}>
          <div className={`pointer-events-none absolute inset-3 border border-dashed border-amber-300/80 ${shapeClass}`} />
          <div className={`pointer-events-none absolute inset-7 border border-dashed border-brand-500/70 ${shapeClass}`} />
          <div className="absolute inset-7 z-10 min-w-0 overflow-hidden">
            {wide ? (
              <WideLabelContent
                brand={brand}
                product={product}
                variant={variant}
                description={description}
                weight={weight}
                form={form}
                legalText={legalText}
                expiredText={expiredText}
              />
            ) : (
              <StandardLabelContent
                compact={compact}
                brand={brand}
                product={product}
                variant={variant}
                description={description}
                weight={weight}
                form={form}
                legalText={legalText}
                expiredText={expiredText}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getShapeClass(shape) {
  if (shape === 'Bulat') return 'rounded-full';
  if (shape === 'Oval') return 'rounded-[50%]';
  if (shape === 'Kotak') return 'rounded-sm';
  if (shape === 'Bottle Wrap') return 'rounded-lg';
  return 'rounded-2xl';
}

function getPreviewAspect(shape, ratio) {
  if (shape === 'Bulat') return 1;
  if (shape === 'Oval') return 1.45;
  if (shape === 'Bottle Wrap') return 3.2;
  return Math.min(Math.max(ratio, 0.72), 1.65);
}

function StandardLabelContent({ compact, brand, product, variant, description, weight, form, legalText, expiredText }) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-between gap-2 text-center">
      <div className="min-w-0 max-w-full">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold uppercase text-brand-700 text-[clamp(9px,1vw,12px)]">{brand}</p>
        <p
          className="mt-1 overflow-hidden text-ellipsis font-extrabold leading-tight text-slate-950"
          style={{
            fontSize: compact ? 'clamp(15px,2vw,22px)' : 'clamp(18px,2.4vw,28px)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product}
        </p>
        <p className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-slate-500 text-[clamp(10px,1vw,13px)]">{variant}</p>
      </div>
      <div className={`${compact ? 'h-[18%] w-[34%]' : 'h-[24%] w-[42%]'} rounded-lg border border-dashed border-slate-300 bg-slate-50`} />
      <div className="min-w-0 max-w-full">
        <p
          className="overflow-hidden text-ellipsis leading-snug text-slate-500 text-[clamp(9px,0.95vw,12px)]"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        >
          {description}
        </p>
        <p className="mt-1 font-bold text-slate-900 text-[clamp(10px,1vw,13px)]">{weight}</p>
      </div>
      <MetaRow form={form} expiredText={expiredText} legalText={legalText} />
    </div>
  );
}

function WideLabelContent({ brand, product, variant, description, weight, form, legalText, expiredText }) {
  return (
    <div className="flex h-full min-h-0 items-center gap-3 overflow-hidden">
      <div className="h-[64%] w-[22%] rounded-lg border border-dashed border-slate-300 bg-slate-50" />
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-bold uppercase text-brand-700 text-[clamp(9px,0.9vw,11px)]">{brand}</p>
        <p
          className="overflow-hidden text-ellipsis font-extrabold leading-tight text-slate-950"
          style={{
            fontSize: 'clamp(16px,2vw,24px)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product}
        </p>
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-slate-500 text-[clamp(9px,0.9vw,12px)]">{variant}</p>
        <p
          className="mt-1 overflow-hidden text-ellipsis leading-snug text-slate-500 text-[clamp(8px,0.85vw,11px)]"
          style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}
        >
          {description}
        </p>
        <p className="mt-1 font-bold text-slate-900 text-[clamp(9px,0.9vw,12px)]">{weight}</p>
      </div>
      <div className="flex max-w-[28%] flex-col items-end gap-1 overflow-hidden">
        <MetaRow form={form} expiredText={expiredText} legalText={legalText} vertical />
      </div>
    </div>
  );
}

function MetaRow({ form, expiredText, legalText, vertical = false }) {
  return (
    <div className={`flex min-w-0 items-end gap-2 overflow-hidden ${vertical ? 'flex-col' : 'justify-center'}`}>
      {form.barcode ? <div className="h-7 w-16 shrink-0 rounded bg-[repeating-linear-gradient(90deg,#111_0_2px,#fff_2px_4px)]" /> : null}
      {form.qr ? <QrBox /> : null}
      {expiredText ? <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] font-semibold text-slate-600">{expiredText}</p> : null}
      {legalText ? <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-slate-400">{legalText}</p> : null}
    </div>
  );
}

function QrBox() {
  return (
    <div className="grid h-9 w-9 shrink-0 grid-cols-3 gap-0.5 rounded bg-slate-900 p-1">
      {Array.from({ length: 9 }).map((_, index) => <span key={index} className={index % 2 ? 'bg-white' : 'bg-slate-900'} />)}
    </div>
  );
}
