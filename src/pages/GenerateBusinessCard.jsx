import { useState } from 'react';
import LicenseGate from '../components/LicenseGate';
import PreviewBusinessCard from '../components/PreviewBusinessCard';
import PromptOutput from '../components/PromptOutput';
import ReviewTextBox from '../components/ReviewTextBox';
import FormLabel from '../components/FormLabel';
import HelpTooltip from '../components/HelpTooltip';
import { helpTexts } from '../data/helpTexts';
import { buildBusinessCardPrompt } from '../engine/businessCardPrompt';
import { getDailyUsage, incrementDailyUsage } from '../utils/storage';
import { ColorField, NumberField, PageTitle, Section, Select, TextField } from './GenerateBanner';

const sizePresets = [
  { id: 'id-standard', name: 'Standard Indonesia 9 x 5.5 cm', width: 9, height: 5.5 },
  { id: 'international', name: 'International 8.9 x 5.1 cm', width: 8.9, height: 5.1 },
  { id: 'square', name: 'Square 6 x 6 cm', width: 6, height: 6 },
  { id: 'custom', name: 'Custom', width: 9, height: 5.5 },
];

const initial = {
  sizePreset: 'id-standard',
  width: 9,
  height: 5.5,
  unit: 'cm',
  orientation: 'Landscape',
  sideMode: 'Satu Sisi',
  material: 'Art Carton 310gsm',
  finishing: 'Tanpa Finishing',
  bleed: 0.3,
  safeArea: 0.3,
  company: '',
  name: '',
  jobTitle: '',
  tagline: '',
  phone: '',
  email: '',
  website: '',
  instagram: '',
  address: '',
  qr: false,
  style: 'Clean Professional',
  primaryColor: '#2563eb',
  secondaryColor: '#10b981',
  typography: '',
  visualElements: '',
  designNotes: '',
  platform: 'ChatGPT Image',
  language: 'Indonesia',
};

export default function GenerateBusinessCard({ license, usage, setUsage, showToast }) {
  const [form, setForm] = useState(initial);
  const [prompt, setPrompt] = useState('');
  const [guide, setGuide] = useState(true);
  const invalid = Number(form.width) <= 0 || Number(form.height) <= 0;

  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selectPreset = (presetId) => {
    const preset = sizePresets.find((item) => item.id === presetId) || sizePresets[0];
    setForm((current) => ({
      ...current,
      sizePreset: presetId,
      width: presetId === 'custom' ? current.width : preset.width,
      height: presetId === 'custom' ? current.height : preset.height,
    }));
  };

  const generate = () => {
    if (invalid) return showToast?.('Ukuran kartu nama harus lebih dari 0.');
    const daily = getDailyUsage();
    if (!license.isPro && daily.count >= 10) return showToast?.('Limit FREE 10 generate per hari sudah habis.');
    setPrompt(buildBusinessCardPrompt(form));
    setUsage(incrementDailyUsage());
    showToast?.('Prompt kartu nama berhasil dibuat.');
  };

  const resetForm = () => {
    setForm(initial);
    setPrompt('');
    showToast?.('Form berhasil direset');
  };

  const renderPromptOutput = () => (
    <PromptOutput
      prompt={prompt}
      category="Kartu Nama"
      title={form.name || form.company || 'Kartu Nama'}
      formData={form}
      platform={form.platform}
      language={form.language}
      layoutSummary={`${form.width} x ${form.height} ${form.unit} ${form.orientation}`}
      isPro={license.isPro}
      onToast={showToast}
    />
  );

  return (
    <LicenseGate isPro={license.isPro} usage={usage}>
      <div className="space-y-6">
        <PageTitle title="Kartu Nama Generator" subtitle="Buat prompt kartu nama siap produksi cetak." />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)] 2xl:grid-cols-[420px_minmax(620px,1fr)_380px]">
          <section className="panel min-w-0 space-y-5 p-5">
            <Section title="Ukuran & Produksi">
              <label>
                <FormLabel helpKey="cardSize">Ukuran Kartu</FormLabel>
                <select className="field" value={form.sizePreset} onChange={(event) => selectPreset(event.target.value)}>
                  {sizePresets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Lebar" value={form.width} onChange={(value) => setValue('width', value)} />
                <NumberField label="Tinggi" value={form.height} onChange={(value) => setValue('height', value)} />
              </div>
              <Select label="Unit" value={form.unit} options={['cm']} onChange={(value) => setValue('unit', value)} />
              <Select label="Orientasi" value={form.orientation} options={['Landscape', 'Portrait']} onChange={(value) => setValue('orientation', value)} />
              <Select label="Sisi Kartu" helpKey="cardSide" value={form.sideMode} options={['Satu Sisi', 'Dua Sisi']} onChange={(value) => setValue('sideMode', value)} />
              <Select label="Bahan Kartu" helpKey="cardMaterial" value={form.material} options={['Art Carton 260gsm', 'Art Carton 310gsm', 'Linen', 'Ivory', 'BC', 'Custom']} onChange={(value) => setValue('material', value)} />
              <Select label="Finishing / Proses Akhir" helpKey="cardFinishing" value={form.finishing} options={['Tanpa Finishing', 'Laminasi Doff', 'Laminasi Glossy', 'Spot UV', 'Rounded Corner']} onChange={(value) => setValue('finishing', value)} />
              <NumberField label="Area Lebih Cetak" helpKey="bleed" value={form.bleed} onChange={(value) => setValue('bleed', value)} />
              <NumberField label="Area Aman Teks" helpKey="safeArea" value={form.safeArea} onChange={(value) => setValue('safeArea', value)} />
            </Section>

            <Section title="Identitas">
              <TextField label="Nama Brand / Perusahaan" value={form.company} onChange={(value) => setValue('company', value)} />
              <TextField label="Nama Orang" value={form.name} onChange={(value) => setValue('name', value)} />
              <TextField label="Jabatan" value={form.jobTitle} onChange={(value) => setValue('jobTitle', value)} />
              <TextField label="Tagline" value={form.tagline} onChange={(value) => setValue('tagline', value)} />
            </Section>

            <Section title="Kontak">
              <TextField label="WhatsApp / Telepon" value={form.phone} onChange={(value) => setValue('phone', value)} />
              <TextField label="Email" value={form.email} onChange={(value) => setValue('email', value)} />
              <TextField label="Website" value={form.website} onChange={(value) => setValue('website', value)} />
              <TextField label="Instagram" value={form.instagram} onChange={(value) => setValue('instagram', value)} />
              <TextField label="Alamat" value={form.address} onChange={(value) => setValue('address', value)} />
              <Toggle label="QR Code" helpKey="qr" checked={form.qr} onChange={(value) => setValue('qr', value)} />
            </Section>

            <Section title="Gaya Visual">
              <Select label="Gaya Desain" value={form.style} options={['Clean Professional', 'Minimalis Modern', 'Premium Elegant', 'Bold Corporate', 'Creative Colorful', 'Luxury Dark']} onChange={(value) => setValue('style', value)} />
              <ColorField label="Warna Utama" value={form.primaryColor} onChange={(value) => setValue('primaryColor', value)} />
              <ColorField label="Warna Pendukung" value={form.secondaryColor} onChange={(value) => setValue('secondaryColor', value)} />
              <TextField label="Gaya Huruf" helpKey="typography" value={form.typography} placeholder="Contoh: modern sans serif, elegan serif, bold clean" onChange={(value) => setValue('typography', value)} />
              <TextField label="Elemen Gambar" helpKey="visualElements" value={form.visualElements} placeholder="Contoh: pattern, garis, icon, logo mark" onChange={(value) => setValue('visualElements', value)} />
              <TextField label="Catatan Desain" value={form.designNotes} placeholder="Contoh: tampil premium, clean, tidak ramai" onChange={(value) => setValue('designNotes', value)} />
            </Section>

            <Section title="Output">
              <Select label="Platform" value={form.platform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('platform', value)} />
              <Select label="Bahasa Output" value={form.language} options={['Indonesia', 'English']} onChange={(value) => setValue('language', value)} />
              <ReviewTextBox
                labelWidth="132px"
                fields={[
                  ['Brand / Perusahaan', form.company],
                  ['Nama', form.name],
                  ['Jabatan', form.jobTitle],
                  ['Tagline', form.tagline],
                  ['WhatsApp / Telepon', form.phone],
                  ['Email', form.email],
                  ['Website', form.website],
                  ['Instagram', form.instagram],
                  ['Alamat', form.address],
                ]}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="btn-primary" type="button" onClick={generate}>Generate Prompt</button>
                <button className="btn-secondary" type="button" onClick={resetForm}>Reset Form</button>
              </div>
            </Section>
          </section>

          <div className="min-w-0 space-y-4">
            <button className="btn-secondary" type="button" onClick={() => setGuide((value) => !value)}>Guide {guide ? 'On' : 'Off'}</button>
            <PreviewBusinessCard form={form} guide={guide} />
            <div className="min-w-0 2xl:hidden">{renderPromptOutput()}</div>
          </div>
          <div className="hidden min-w-0 2xl:block">{renderPromptOutput()}</div>
        </div>
      </div>
    </LicenseGate>
  );
}

function Toggle({ label, helpKey, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
      <span className="inline-flex items-center gap-2">
        {label}
        {helpKey ? <HelpTooltip text={helpTexts[helpKey]} /> : null}
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
