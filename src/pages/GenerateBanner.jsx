import { useState } from 'react';
import LicenseGate from '../components/LicenseGate';
import PreviewBanner from '../components/PreviewBanner';
import PromptOutput from '../components/PromptOutput';
import ReviewTextBox from '../components/ReviewTextBox';
import FormLabel from '../components/FormLabel';
import { buildBannerPrompt, getBannerRatioStatus } from '../engine/bannerPrompt';
import { getDailyUsage, incrementDailyUsage } from '../utils/storage';

const initial = {
  width: 300,
  height: 100,
  orientation: 'Horizontal',
  material: 'Flexi China 280gsm',
  finishing: 'Mata Ayam',
  bleed: 1,
  brand: '',
  headline: '',
  subheadline: '',
  cta: '',
  phone: '',
  website: '',
  address: '',
  theme: 'Modern & Profesional',
  primaryColor: '#2563eb',
  audience: '',
  visualElements: '',
  platform: 'ChatGPT Image',
  language: 'Indonesia',
};

export default function GenerateBanner({ license, usage, setUsage, showToast }) {
  const [form, setForm] = useState(initial);
  const [prompt, setPrompt] = useState('');
  const [guide, setGuide] = useState(true);
  const ratio = getBannerRatioStatus(form.width, form.height);
  const invalid = Number(form.width) <= 0 || Number(form.height) <= 0;
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const generate = () => {
    if (invalid) return showToast?.('Ukuran banner harus lebih dari 0.');
    const daily = getDailyUsage();
    if (!license.isPro && daily.count >= 10) return showToast?.('Limit FREE 10 generate per hari sudah habis.');
    setPrompt(buildBannerPrompt(form));
    setUsage(incrementDailyUsage());
    showToast?.('Prompt banner berhasil dibuat.');
  };

  const resetForm = () => {
    setForm(initial);
    setPrompt('');
    showToast?.('Form berhasil direset');
  };

  const renderPromptOutput = () => (
    <PromptOutput
      prompt={prompt}
      category="Banner"
      title={form.headline || 'Banner Prompt'}
      formData={form}
      platform={form.platform}
      language={form.language}
      layoutSummary={`${form.width} x ${form.height} cm`}
      isPro={license.isPro}
      onToast={showToast}
    />
  );

  return (
    <LicenseGate isPro={license.isPro} usage={usage}>
      <div className="space-y-6">
        <PageTitle title="Banner / Spanduk Generator" subtitle="Buat prompt dan wireframe banner yang rapi untuk produksi." />
        {ratio.ratio > 5 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Ukuran ini memiliki rasio ekstrem. Disarankan gunakan AI untuk konsep/background, lalu susun teks final di software desain.
          </div>
        ) : null}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(620px,1fr)_380px]">
          <section className="panel min-w-0 space-y-5 p-5">
            <Section title="Ukuran & Media">
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Width cm" value={form.width} onChange={(value) => setValue('width', value)} />
                <NumberField label="Height cm" value={form.height} onChange={(value) => setValue('height', value)} />
              </div>
              <Select label="Orientation" value={form.orientation} options={['Horizontal', 'Vertical']} onChange={(value) => setValue('orientation', value)} />
              <Select label="Bahan Banner" helpKey="bannerMaterial" value={form.material} options={['Flexi China 280gsm', 'Flexi Korea', 'Albatros', 'Luster', 'Custom']} onChange={(value) => setValue('material', value)} />
              <Select label="Finishing / Proses Akhir" helpKey="finishing" value={form.finishing} options={['Mata Ayam', 'Selongsong', 'Laminasi', 'Tanpa Finishing']} onChange={(value) => setValue('finishing', value)} />
              <Select label="Area Lebih Cetak" helpKey="bleed" value={form.bleed} options={[0, 1, 2, 3]} onChange={(value) => setValue('bleed', value)} />
            </Section>
            <Section title="Konten Teks">
              {[
                ['brand', 'Brand / Logo text'],
                ['headline', 'Headline utama'],
                ['subheadline', 'Subheadline'],
                ['cta', 'Ajakan / Tombol Aksi', 'Contoh: Pesan Sekarang', 'action'],
                ['phone', 'Phone / WhatsApp'],
                ['website', 'Website'],
                ['address', 'Address'],
              ].map(([key, label, placeholder, helpKey]) => <TextField key={key} label={label} value={form[key]} placeholder={placeholder} helpKey={helpKey} onChange={(value) => setValue(key, value)} />)}
            </Section>
            <Section title="Gaya Visual">
              <Select label="Theme" value={form.theme} options={['Modern & Profesional', 'Promo Cerah', 'Corporate', 'Minimalis', 'Futuristik', 'Sekolah', 'Food Promo']} onChange={(value) => setValue('theme', value)} />
              <ColorField label="Warna Utama" value={form.primaryColor} onChange={(value) => setValue('primaryColor', value)} />
              <TextField label="Target Pembaca / Pelanggan" value={form.audience} placeholder="Contoh: calon pembeli, pelajar, owner percetakan" helpKey="audience" onChange={(value) => setValue('audience', value)} />
              <TextField label="Elemen Gambar" value={form.visualElements} placeholder="Contoh: mesin cetak, produk, pattern modern" helpKey="visualElements" onChange={(value) => setValue('visualElements', value)} />
            </Section>
            <Section title="Output">
              <Select label="Platform" value={form.platform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('platform', value)} />
              <Select label="Language" value={form.language} options={['Indonesia', 'English']} onChange={(value) => setValue('language', value)} />
              <ReviewTextBox
                labelWidth="120px"
                fields={[
                  ['Brand / Logo Text', form.brand],
                  ['Headline Utama', form.headline],
                  ['Subheadline', form.subheadline],
                  ['Ajakan / Tombol Aksi', form.cta],
                  ['WhatsApp', form.phone],
                  ['Website', form.website],
                  ['Alamat', form.address],
                ]}
                warnings={[
                  !form.brand.trim() ? 'Brand / Logo Text masih kosong.' : null,
                  form.headline.trim().length > 0 && form.headline.trim().length < 5 ? 'Headline terlihat sangat pendek. Pastikan sudah sesuai.' : null,
                ].filter(Boolean)}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="btn-primary" type="button" onClick={generate}>Generate Prompt</button>
                <button className="btn-secondary" type="button" onClick={resetForm}>Reset Form</button>
              </div>
            </Section>
          </section>
          <div className="min-w-0 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">Rasio Ukuran {ratio.ratio.toFixed(2)} / {ratio.label}</span>
              <button className="btn-secondary" type="button" onClick={() => setGuide((value) => !value)}>Guide {guide ? 'On' : 'Off'}</button>
            </div>
            <PreviewBanner form={form} guide={guide} />
            <div className="min-w-0 2xl:hidden">{renderPromptOutput()}</div>
          </div>
          <div className="hidden min-w-0 2xl:block">{renderPromptOutput()}</div>
        </div>
      </div>
    </LicenseGate>
  );
}

export function PageTitle({ title, subtitle }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-1 text-slate-600">{subtitle}</p>
    </div>
  );
}

export function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-bold text-slate-950">{title}</h2>
      {children}
    </div>
  );
}

export function TextField({ label, value, onChange, placeholder, helpKey }) {
  return (
    <label>
      <FormLabel helpKey={helpKey}>{label}</FormLabel>
      <input className="field" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function NumberField({ label, value, onChange, step = 0.1, helpKey }) {
  return (
    <label>
      <FormLabel helpKey={helpKey}>{label}</FormLabel>
      <input className="field" type="number" min="0" step={step} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} />
    </label>
  );
}

export function Select({ label, value, options, onChange, helpKey }) {
  return (
    <label>
      <FormLabel helpKey={helpKey}>{label}</FormLabel>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

export function ColorField({ label, value, onChange, helpKey }) {
  return (
    <label>
      <FormLabel helpKey={helpKey}>{label}</FormLabel>
      <div className="flex gap-2">
        <input className="h-10 w-12 rounded-lg border border-slate-200 bg-white p-1" type="color" value={value} onChange={(event) => onChange(event.target.value)} />
        <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </label>
  );
}
