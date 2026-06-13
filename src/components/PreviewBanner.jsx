export default function PreviewBanner({ form, guide = true }) {
  const width = Math.max(1, Number(form.width) || 1);
  const height = Math.max(1, Number(form.height) || 1);
  const horizontal = width >= height;
  const aspectRatio = Math.max(width, height) / Math.max(1, Math.min(width, height));
  const aspect = width / height;
  const mode = aspectRatio <= 3 ? 'normal' : aspectRatio <= 5 ? 'wide' : 'extreme';
  const visualAspect = horizontal
    ? Math.min(Math.max(aspect, 1.4), mode === 'extreme' ? 6.8 : 5)
    : Math.max(Math.min(aspect, 0.75), 0.42);
  const brand = form.brand || 'BRAND';
  const headline = form.headline || 'Headline Utama';
  const subheadline = form.subheadline || 'Subheadline promosi atau informasi utama';
  const cta = form.cta || 'CTA';
  const phone = form.phone || 'WhatsApp';
  const footer = form.website || form.address || 'Website / Alamat';
  const wrapperHeight = horizontal
    ? mode === 'extreme'
      ? 'min-h-[160px]'
      : mode === 'wide'
        ? 'min-h-[230px]'
        : 'min-h-[280px]'
    : 'min-h-[420px]';

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Live Preview</p>
          <p className="text-xs text-slate-500">{form.width} x {form.height} cm</p>
        </div>
      </div>
      <div className={`flex items-center overflow-hidden rounded-xl bg-slate-100 p-4 ${wrapperHeight}`}>
        <div
          className="relative mx-auto w-full max-w-[820px] overflow-hidden rounded-xl border bg-white shadow-soft"
          style={{
            aspectRatio: visualAspect,
            borderColor: guide ? '#fca5a5' : '#d6dbe5',
            maxHeight: horizontal ? '520px' : '620px',
          }}
        >
          {guide ? (
            <>
              <div className="pointer-events-none absolute inset-0 z-0 rounded-xl border border-red-300" />
              <div className="pointer-events-none absolute inset-[6%] z-0 rounded-lg border border-dashed border-brand-500/60" />
            </>
          ) : null}
          <div className="absolute inset-[6%] z-10 min-w-0">
            {mode === 'normal' ? (
              <NormalBannerContent brand={brand} headline={headline} subheadline={subheadline} cta={cta} phone={phone} footer={footer} />
            ) : mode === 'wide' ? (
              <WideBannerContent brand={brand} headline={headline} subheadline={subheadline} cta={cta} phone={phone} footer={footer} />
            ) : (
              <ExtremeBannerContent brand={brand} headline={headline} subheadline={subheadline} cta={cta} phone={phone} footer={footer} />
            )}
          </div>
        </div>
      </div>
      {mode === 'extreme' ? (
        <p className="mt-3 text-xs font-medium text-amber-700">
          Mode preview ekstrem: fokus komposisi/background, teks final disarankan disusun manual.
        </p>
      ) : null}
      <p className="mt-2 text-xs text-slate-500">Preview menggunakan skala visual, bukan ukuran cetak asli.</p>
    </div>
  );
}

function NormalBannerContent({ brand, headline, subheadline, cta, phone, footer }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-[3%]">
      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_24%] gap-[5%] overflow-hidden">
        <div className="flex min-w-0 flex-col justify-center overflow-hidden">
          <Badge>{brand}</Badge>
          <Headline max="36px" size="clamp(24px,3vw,36px)" lines={2}>{headline}</Headline>
          <Subheadline max="16px" size="clamp(11px,1.25vw,16px)" lines={2}>{subheadline}</Subheadline>
          <Cta>{cta}</Cta>
        </div>
        <HeroBox />
      </div>
      <FooterStrip height="17%" size="clamp(9px,0.95vw,12px)" phone={phone} footer={footer} />
    </div>
  );
}

function WideBannerContent({ brand, headline, subheadline, cta, phone, footer }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-[2.5%]">
      <div className="flex min-h-0 flex-1 items-center gap-[3%] overflow-hidden">
        <div className="flex w-[17%] min-w-20 max-w-32 flex-col gap-2 overflow-hidden">
          <Badge small>{brand}</Badge>
          <Cta small>{cta}</Cta>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <Headline size="clamp(20px,2.4vw,30px)" lines={2}>{headline}</Headline>
          <Subheadline size="clamp(10px,1.1vw,14px)" lines={1}>{subheadline}</Subheadline>
        </div>
        <HeroBox compact />
      </div>
      <FooterStrip height="15%" size="clamp(8px,0.9vw,11px)" phone={phone} footer={footer} />
    </div>
  );
}

function ExtremeBannerContent({ brand, headline, subheadline, cta, phone, footer }) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-[2%]">
      <div className="flex min-h-0 flex-1 items-center gap-3 overflow-hidden">
        <div className="flex w-[18%] min-w-20 max-w-32 flex-col justify-center gap-1.5 overflow-hidden">
          <Badge small>{brand}</Badge>
          <Cta small>{cta}</Cta>
        </div>
        <div className="min-w-0 flex-1 overflow-hidden">
          <Headline size="clamp(16px,1.8vw,24px)" lines={2}>{headline}</Headline>
          <Subheadline size="clamp(9px,0.95vw,13px)" lines={1}>{subheadline}</Subheadline>
        </div>
        <HeroBox tiny />
      </div>
      <FooterStrip height="18%" size="clamp(8px,0.8vw,10px)" phone={phone} footer={footer} />
    </div>
  );
}

function Badge({ children, small = false }) {
  return (
    <div className={`max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded bg-slate-900 px-2.5 py-1 text-center font-bold text-white ${small ? 'text-[clamp(9px,0.9vw,11px)]' : 'text-[clamp(10px,1vw,12px)]'}`}>
      {children}
    </div>
  );
}

function Headline({ children, size, lines }) {
  return (
    <p
      className="mt-2 overflow-hidden text-ellipsis font-extrabold leading-tight text-slate-950"
      style={{
        fontSize: size,
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {children}
    </p>
  );
}

function Subheadline({ children, size, lines }) {
  return (
    <p
      className="mt-1.5 overflow-hidden text-ellipsis leading-snug text-slate-500"
      style={{
        fontSize: size,
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
      }}
    >
      {children}
    </p>
  );
}

function Cta({ children, small = false }) {
  return (
    <div className={`mt-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full bg-brand-600 font-bold text-white ${small ? 'px-2.5 py-1 text-[clamp(9px,0.9vw,11px)]' : 'px-4 py-1.5 text-[clamp(10px,1vw,13px)]'}`}>
      {children}
    </div>
  );
}

function HeroBox({ compact = false, tiny = false }) {
  if (tiny) {
    return <div className="hidden h-[58%] w-[12%] rounded-md border border-dashed border-slate-300 bg-slate-50 md:block" />;
  }
  return (
    <div
      className={`self-center rounded-lg border border-dashed border-slate-300 bg-slate-50 ${
        compact ? 'h-[58%] w-[16%]' : 'h-[64%] w-full'
      }`}
    />
  );
}

function FooterStrip({ height, size, phone, footer }) {
  return (
    <div
      className="flex min-h-[18px] max-h-14 items-center justify-between gap-3 rounded-md bg-navy-900 px-[3%] py-1.5 font-medium text-white"
      style={{ height, fontSize: size }}
    >
      <span className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap">{phone}</span>
      <span className="min-w-0 max-w-[50%] overflow-hidden text-ellipsis whitespace-nowrap text-right">{footer}</span>
    </div>
  );
}
