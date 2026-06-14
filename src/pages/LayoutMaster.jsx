import { useMemo, useState } from 'react';
import PreviewLayoutGrid from '../components/PreviewLayoutGrid';
import { getPaperSize, paperSizes } from '../data/paperSizes';
import { calculateLayout } from '../engine/calculateLayout';
import { formatCm } from '../utils/formatters';
import FormLabel from '../components/FormLabel';

const initial = {
  paperId: 'a3plus-konica',
  customWidth: 32.5,
  customHeight: 48.5,
  marginTop: 0.5,
  marginBottom: 0.5,
  marginLeft: 0.5,
  marginRight: 0.5,
  designWidth: 10,
  designHeight: 5,
  gapX: 0.2,
  gapY: 0.2,
  shape: 'Kotak',
  mode: 'Otomatis Terbaik',
};

const numberFields = ['customWidth', 'customHeight', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'designWidth', 'designHeight', 'gapX', 'gapY'];

export default function LayoutMaster({ showToast }) {
  const [form, setForm] = useState(initial);
  const [guide, setGuide] = useState(true);
  const paper = getPaperSize(form.paperId);
  const paperWidth = form.paperId === 'custom' ? Number(form.customWidth) : paper.width;
  const paperHeight = form.paperId === 'custom' ? Number(form.customHeight) : paper.height;
  const result = useMemo(
    () =>
      calculateLayout({
        ...form,
        paperWidth,
        paperHeight,
      }),
    [form, paperWidth, paperHeight],
  );

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: numberFields.includes(key) ? Math.max(0, Number(value)) : value }));

  const selectPaper = (paperId) => {
    const nextPaper = getPaperSize(paperId);
    const margins = nextPaper.defaultMargins || { top: 0, bottom: 0, left: 0, right: 0 };
    setForm((current) => ({
      ...current,
      paperId,
      customWidth: paperId === 'custom' ? current.customWidth : nextPaper.width,
      customHeight: paperId === 'custom' ? current.customHeight : nextPaper.height,
      marginTop: margins.top,
      marginBottom: margins.bottom,
      marginLeft: margins.left,
      marginRight: margins.right,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Layout Master Calculator</h1>
        <p className="mt-1 text-slate-600">Hitung berapa desain yang muat dalam satu lembar.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section className="panel p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <FormLabel helpKey="paperSize">Ukuran Kertas</FormLabel>
              <select className="field" value={form.paperId} onChange={(event) => selectPaper(event.target.value)}>
                {paperSizes.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
              {paper.machineNote ? <p className="mt-2 text-xs font-medium text-brand-700">{paper.machineNote}</p> : null}
            </label>
            {form.paperId === 'custom' ? (
              <>
                <Field label="Custom width (cm)" value={form.customWidth} onChange={(value) => setValue('customWidth', value)} />
                <Field label="Custom height (cm)" value={form.customHeight} onChange={(value) => setValue('customHeight', value)} />
              </>
            ) : null}
            <Field label="Margin atas" helpKey="margin" value={form.marginTop} onChange={(value) => setValue('marginTop', value)} />
            <Field label="Margin bawah" helpKey="margin" value={form.marginBottom} onChange={(value) => setValue('marginBottom', value)} />
            <Field label="Margin kiri" helpKey="margin" value={form.marginLeft} onChange={(value) => setValue('marginLeft', value)} />
            <Field label="Margin kanan" helpKey="margin" value={form.marginRight} onChange={(value) => setValue('marginRight', value)} />
            <Field label="Ukuran Desain - Lebar" helpKey="designSize" value={form.designWidth} onChange={(value) => setValue('designWidth', value)} />
            <Field label="Ukuran Desain - Tinggi" helpKey="designSize" value={form.designHeight} onChange={(value) => setValue('designHeight', value)} />
            <Field label="Jarak Antar Desain X" helpKey="designGap" value={form.gapX} onChange={(value) => setValue('gapX', value)} />
            <Field label="Jarak Antar Desain Y" helpKey="designGap" value={form.gapY} onChange={(value) => setValue('gapY', value)} />
            <label>
              <span className="field-label">Shape</span>
              <select className="field" value={form.shape} onChange={(event) => setValue('shape', event.target.value)}>
                {['Kotak', 'Persegi Panjang', 'Bulat', 'Oval', 'Rounded Corner', 'Custom Shape'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              <FormLabel helpKey={form.mode === 'Rotasi' ? 'rotation' : form.mode === 'Otomatis Terbaik' ? 'autoBest' : undefined}>Mode Hitung</FormLabel>
              <select className="field" value={form.mode} onChange={(event) => setValue('mode', event.target.value)}>
                {['Normal', 'Rotasi', 'Otomatis Terbaik'].map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>
        </section>
        <div className="space-y-6">
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Result label="Total muat per lembar" value={result.total} />
            <Result label="Grid kolom x baris" value={`${result.columns} x ${result.rows}`} />
            <Result label="Posisi" value={result.orientation} />
            <Result label="Area Efektif Cetak" value={`${formatCm(result.effectiveWidth)} x ${formatCm(result.effectiveHeight)} cm`} hint={paper.machineNote} />
            <Result label="Luas layout used" value={`${formatCm(result.usedArea)} cm2`} />
            <Result label="Sisa Area Horizontal" value={`${formatCm(result.remainingX)} cm`} />
            <Result label="Sisa Area Vertical" value={`${formatCm(result.remainingY)} cm`} />
            <Result label="Paper" value={`${formatCm(paperWidth)} x ${formatCm(paperHeight)} cm`} />
          </section>
          <div className={`rounded-xl border px-4 py-3 text-sm ${result.total === 0 ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900'}`}>
            {result.recommendation}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" type="button" onClick={() => setGuide((value) => !value)}>Guide {guide ? 'On' : 'Off'}</button>
            <button className="btn-secondary" type="button" onClick={() => showToast?.('Export PNG coming soon.')}>Export PNG</button>
          </div>
          <PreviewLayoutGrid result={result} shape={form.shape} guide={guide} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, helpKey }) {
  return (
    <label>
      <FormLabel helpKey={helpKey}>{label}</FormLabel>
      <input className="field" type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Result({ label, value, hint }) {
  return (
    <div className="panel p-4">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}
