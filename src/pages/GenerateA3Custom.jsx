import { useState } from 'react';
import LicenseGate from '../components/LicenseGate';
import PreviewA3 from '../components/PreviewA3';
import PromptOutput from '../components/PromptOutput';
import ReviewTextBox from '../components/ReviewTextBox';
import { getPaperSize, paperSizes } from '../data/paperSizes';
import { buildA3Prompt } from '../engine/a3Prompt';
import { getDailyUsage, incrementDailyUsage } from '../utils/storage';
import { ColorField, NumberField, PageTitle, Section, Select, TextField } from './GenerateBanner';

const initial = {
  layoutType: 'Product Catalog Grid',
  paperId: 'a3',
  customWidth: 29.7,
  customHeight: 42,
  orientation: 'Portrait',
  title: '',
  brand: '',
  subtitle: '',
  footerInfo: '',
  columns: 3,
  itemCount: 9,
  items: '',
  showPrice: true,
  showDescription: true,
  showFooter: true,
  margin: 1.5,
  gutter: 0.6,
  headerHeight: 4,
  footerHeight: 2,
  primaryColor: '#2563eb',
  secondaryColor: '#10b981',
  mood: '',
  typography: '',
  backgroundStyle: '',
  platform: 'ChatGPT Image',
  language: 'Indonesia',
};

export default function GenerateA3Custom({ license, usage, setUsage, showToast }) {
  const [form, setForm] = useState(initial);
  const [prompt, setPrompt] = useState('');
  const [guide, setGuide] = useState(true);
  const basePaper = getPaperSize(form.paperId);
  const paper = form.paperId === 'custom' ? { name: 'Custom', width: form.customWidth, height: form.customHeight } : basePaper;
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const generate = () => {
    const daily = getDailyUsage();
    if (!license.isPro && daily.count >= 10) return showToast?.('Limit FREE 10 generate per hari sudah habis.');
    setPrompt(buildA3Prompt(form, paper));
    setUsage(incrementDailyUsage());
    showToast?.('Prompt A3 berhasil dibuat.');
  };

  const resetForm = () => {
    setForm(initial);
    setPrompt('');
    showToast?.('Form berhasil direset');
  };

  return (
    <LicenseGate isPro={license.isPro} usage={usage}>
      <div className="space-y-6">
        <PageTitle title="A3 Custom Generator" subtitle="Susun prompt layout grid katalog, menu, price list, atau promo sheet." />
        <div className="grid gap-6 2xl:grid-cols-[380px_minmax(420px,1fr)_420px]">
          <section className="panel space-y-5 p-5">
            <Section title="Preset / Layout">
              <Select label="Layout type" value={form.layoutType} options={['Product Catalog Grid', 'Menu List', 'Price List', 'Promo Sheet', 'Collage Product']} onChange={(value) => setValue('layoutType', value)} />
              <Select label="Paper size" value={form.paperId} options={paperSizes.map((item) => item.id)} onChange={(value) => setValue('paperId', value)} />
              {form.paperId === 'custom' ? (
                <div className="grid grid-cols-2 gap-3">
                  <NumberField label="Custom width" value={form.customWidth} onChange={(value) => setValue('customWidth', value)} />
                  <NumberField label="Custom height" value={form.customHeight} onChange={(value) => setValue('customHeight', value)} />
                </div>
              ) : null}
              <Select label="Orientation" value={form.orientation} options={['Portrait', 'Landscape']} onChange={(value) => setValue('orientation', value)} />
            </Section>
            <Section title="Struktur Konten">
              <TextField label="Main title" value={form.title} onChange={(value) => setValue('title', value)} />
              <TextField label="Brand name" value={form.brand} onChange={(value) => setValue('brand', value)} />
              <TextField label="Subtitle" value={form.subtitle} onChange={(value) => setValue('subtitle', value)} />
              <TextField label="Footer info" value={form.footerInfo} placeholder="Contoh: alamat, kontak, sosial media" onChange={(value) => setValue('footerInfo', value)} />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Jumlah Kolom" helpKey="columns" value={form.columns} onChange={(value) => setValue('columns', Math.max(1, Math.round(value)))} step={1} />
                <NumberField label="Jumlah Item" helpKey="itemCount" value={form.itemCount} onChange={(value) => setValue('itemCount', Math.max(1, Math.round(value)))} step={1} />
              </div>
              <label>
                <span className="field-label">Item names</span>
                <textarea className="field min-h-24" value={form.items} onChange={(event) => setValue('items', event.target.value)} placeholder="Satu item per baris" />
              </label>
              <Toggle label="Tampilkan Harga" checked={form.showPrice} onChange={(value) => setValue('showPrice', value)} />
              <Toggle label="Tampilkan Deskripsi" checked={form.showDescription} onChange={(value) => setValue('showDescription', value)} />
              <Toggle label="Tampilkan Footer" checked={form.showFooter} onChange={(value) => setValue('showFooter', value)} />
            </Section>
            <Section title="Grid & Margin">
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Margin" helpKey="margin" value={form.margin} onChange={(value) => setValue('margin', value)} />
                <NumberField label="Jarak Antar Item" helpKey="gutter" value={form.gutter} onChange={(value) => setValue('gutter', value)} />
                <NumberField label="Tinggi Area Judul" helpKey="headerHeight" value={form.headerHeight} onChange={(value) => setValue('headerHeight', value)} />
                <NumberField label="Tinggi Area Bawah" helpKey="footerHeight" value={form.footerHeight} onChange={(value) => setValue('footerHeight', value)} />
              </div>
            </Section>
            <Section title="Visual Style">
              <ColorField label="Warna Utama" value={form.primaryColor} onChange={(value) => setValue('primaryColor', value)} />
              <ColorField label="Warna Pendukung" value={form.secondaryColor} onChange={(value) => setValue('secondaryColor', value)} />
              <TextField label="Nuansa Desain" value={form.mood} onChange={(value) => setValue('mood', value)} />
              <TextField label="Gaya Huruf" helpKey="typography" value={form.typography} placeholder="Contoh: Sans Serif Modern" onChange={(value) => setValue('typography', value)} />
              <TextField label="Gaya Background" helpKey="backgroundStyle" value={form.backgroundStyle} placeholder="Contoh: clean light, orange soft, dark premium" onChange={(value) => setValue('backgroundStyle', value)} />
            </Section>
            <Section title="Output">
              <Select label="Platform" value={form.platform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('platform', value)} />
              <Select label="Language" value={form.language} options={['Indonesia', 'English']} onChange={(value) => setValue('language', value)} />
              <ReviewTextBox
                labelWidth="96px"
                fields={[
                  ['Main Title', form.title],
                  ['Brand Name', form.brand],
                  ['Subtitle', form.subtitle],
                  ['Footer Info', form.footerInfo],
                ]}
                items={form.items.split('\n').map((item) => item.trim()).filter(Boolean)}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="btn-primary" type="button" onClick={generate}>Generate Prompt</button>
                <button className="btn-secondary" type="button" onClick={resetForm}>Reset Form</button>
              </div>
            </Section>
          </section>
          <div className="space-y-4">
            <button className="btn-secondary" type="button" onClick={() => setGuide((value) => !value)}>Guide {guide ? 'On' : 'Off'}</button>
            <PreviewA3 form={form} paper={paper} guide={guide} />
          </div>
          <PromptOutput prompt={prompt} category="A3 Custom" title={form.title || 'A3 Custom Prompt'} formData={form} platform={form.platform} language={form.language} layoutSummary={`${paper.name} ${form.orientation}`} isPro={license.isPro} onToast={showToast} />
        </div>
      </div>
    </LicenseGate>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
