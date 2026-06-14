import { useState } from 'react';
import LicenseGate from '../components/LicenseGate';
import PreviewSticker from '../components/PreviewSticker';
import PromptOutput from '../components/PromptOutput';
import ReviewTextBox from '../components/ReviewTextBox';
import { buildStickerPrompt } from '../engine/stickerPrompt';
import { getDailyUsage, incrementDailyUsage } from '../utils/storage';
import { ColorField, NumberField, PageTitle, Section, Select, TextField } from './GenerateBanner';

const initial = {
  brand: '',
  productName: '',
  variant: '',
  description: '',
  weight: '',
  shape: 'Rounded Rectangle',
  width: 80,
  height: 60,
  unit: 'mm',
  cornerRadius: 4,
  bleed: 2,
  material: 'Vinyl White',
  finishing: 'Glossy',
  printer: 'Digital / Inkjet',
  usage: 'Packaging',
  primaryColor: '#2563eb',
  secondaryColor: '#10b981',
  style: 'Minimalis',
  typography: '',
  visualElements: '',
  composition: '',
  expiredDateText: '',
  socialMedia: '',
  legalInfo: '',
  barcode: false,
  qr: false,
  halal: false,
  expired: false,
  batch: false,
  social: false,
  legal: false,
  platform: 'ChatGPT Image',
  language: 'Indonesia',
};

export default function GenerateStickerLabel({ license, usage, setUsage, showToast }) {
  const [form, setForm] = useState(initial);
  const [prompt, setPrompt] = useState('');
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const invalid = Number(form.width) <= 0 || Number(form.height) <= 0;

  const generate = () => {
    if (invalid) return showToast?.('Ukuran label harus lebih dari 0.');
    const daily = getDailyUsage();
    if (!license.isPro && daily.count >= 10) return showToast?.('Limit FREE 10 generate per hari sudah habis.');
    setPrompt(buildStickerPrompt(form));
    setUsage(incrementDailyUsage());
    showToast?.('Prompt stiker berhasil dibuat.');
  };

  return (
    <LicenseGate isPro={license.isPro} usage={usage}>
      <div className="space-y-6">
        <PageTitle title="Stiker / Label Generator" subtitle="Buat prompt label kemasan dengan cutline, bleed, dan safe area." />
        <div className="grid gap-6 2xl:grid-cols-[380px_minmax(420px,1fr)_420px]">
          <section className="panel space-y-5 p-5">
            <Section title="Informasi Produk">
              {[
                ['brand', 'Brand'],
                ['productName', 'Product name'],
                ['variant', 'Varian Produk'],
                ['description', 'Description'],
                ['weight', 'Berat / Isi Produk'],
              ].map(([key, label]) => <TextField key={key} label={label} value={form[key]} onChange={(value) => setValue(key, value)} />)}
            </Section>
            <Section title="Detail Ukuran">
              <Select label="Shape" value={form.shape} options={['Bulat', 'Kotak', 'Rounded Rectangle', 'Oval', 'Bottle Wrap']} onChange={(value) => setValue('shape', value)} />
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Width" value={form.width} onChange={(value) => setValue('width', value)} />
                <NumberField label="Height" value={form.height} onChange={(value) => setValue('height', value)} />
              </div>
              <Select label="Unit" value={form.unit} options={['mm', 'cm']} onChange={(value) => setValue('unit', value)} />
              <NumberField label="Corner radius" value={form.cornerRadius} onChange={(value) => setValue('cornerRadius', value)} />
              <NumberField label="Area Lebih Cetak" helpKey="bleed" value={form.bleed} onChange={(value) => setValue('bleed', value)} />
            </Section>
            <Section title="Material & Produksi">
              <Select label="Bahan Stiker / Label" helpKey="stickerMaterial" value={form.material} options={['Vinyl White', 'Vinyl Transparent', 'Chromo', 'Kraft', 'Bontax', 'Custom']} onChange={(value) => setValue('material', value)} />
              <Select label="Finishing / Lapisan Akhir" helpKey="finishing" value={form.finishing} options={['Glossy', 'Doff', 'Tanpa Laminasi']} onChange={(value) => setValue('finishing', value)} />
              <Select label="Printer" value={form.printer} options={['Digital / Inkjet', 'Offset']} onChange={(value) => setValue('printer', value)} />
              <Select label="Usage" value={form.usage} options={['Indoor', 'Outdoor', 'Packaging']} onChange={(value) => setValue('usage', value)} />
            </Section>
            <Section title="Gaya Visual">
              <ColorField label="Warna Utama" value={form.primaryColor} onChange={(value) => setValue('primaryColor', value)} />
              <ColorField label="Warna Pendukung" value={form.secondaryColor} onChange={(value) => setValue('secondaryColor', value)} />
              <Select label="Style" value={form.style} options={['Minimalis', 'Premium', 'Cute', 'Natural', 'Modern', 'Bold']} onChange={(value) => setValue('style', value)} />
              <TextField label="Gaya Huruf" helpKey="typography" value={form.typography} onChange={(value) => setValue('typography', value)} />
              <TextField label="Elemen Gambar" helpKey="visualElements" value={form.visualElements} placeholder="Contoh: biji kopi, daun, ilustrasi produk" onChange={(value) => setValue('visualElements', value)} />
            </Section>
            <Section title="Elemen Tambahan">
              <TextField label="Komposisi Produk" helpKey="composition" value={form.composition} placeholder="Contoh: kopi arabica, gula, susu" onChange={(value) => setValue('composition', value)} />
              <TextField label="Tanggal Kedaluwarsa" helpKey="expiredDate" value={form.expiredDateText} placeholder="Contoh: 20-12-2026" onChange={(value) => setValue('expiredDateText', value)} />
              <TextField label="Social Media" value={form.socialMedia} onChange={(value) => setValue('socialMedia', value)} />
              <TextField label="Legal Info" value={form.legalInfo} onChange={(value) => setValue('legalInfo', value)} />
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['barcode', 'Barcode'],
                  ['qr', 'QR Code'],
                  ['halal', 'Halal icon'],
                  ['expired', 'Expired date'],
                  ['batch', 'Batch number'],
                  ['social', 'Social media'],
                  ['legal', 'Legal info'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700">
                    <input type="checkbox" checked={form[key]} onChange={(event) => setValue(key, event.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>
            </Section>
            <Section title="Output">
              <Select label="Platform" value={form.platform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('platform', value)} />
              <Select label="Language" value={form.language} options={['Indonesia', 'English']} onChange={(value) => setValue('language', value)} />
              <ReviewTextBox
                fields={[
                  ['Brand', form.brand],
                  ['Product Name', form.productName],
                  ['Variant', form.variant],
                  ['Description', form.description],
                  ['Weight/Volume', form.weight],
                  ['Composition', form.composition],
                  ['Expired Date', form.expiredDateText],
                  ['Social Media', form.socialMedia],
                  ['Legal Info', form.legalInfo],
                ]}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="btn-primary" type="button" onClick={generate}>Generate Prompt</button>
                <button className="btn-secondary" type="button" onClick={() => { setForm(initial); setPrompt(''); }}>Reset</button>
              </div>
            </Section>
          </section>
          <PreviewSticker form={form} />
          <PromptOutput prompt={prompt} category="Sticker" title={form.productName || 'Sticker Prompt'} formData={form} platform={form.platform} language={form.language} layoutSummary={`${form.width} x ${form.height} ${form.unit}`} isPro={license.isPro} onToast={showToast} />
        </div>
      </div>
    </LicenseGate>
  );
}
