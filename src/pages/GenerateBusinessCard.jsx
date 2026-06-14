import { useState } from 'react';
import LicenseGate from '../components/LicenseGate';
import PreviewBusinessCard from '../components/PreviewBusinessCard';
import PromptOutput from '../components/PromptOutput';
import ReviewTextBox from '../components/ReviewTextBox';
import { buildBusinessCardPrompt } from '../engine/businessCardPrompt';
import { getDailyUsage, incrementDailyUsage } from '../utils/storage';
import { ColorField, NumberField, PageTitle, Section, Select, TextField } from './GenerateBanner';

const sizePresets = [
  { id: 'id-standard', name: 'Standard Indonesia', width: 9, height: 5.5 },
  { id: 'international', name: 'Standard International', width: 8.9, height: 5.1 },
  { id: 'square', name: 'Square Card', width: 6, height: 6 },
  { id: 'custom', name: 'Custom', width: 9, height: 5.5 },
];

const initial = {
  sizePreset: 'id-standard',
  width: 9,
  height: 5.5,
  unit: 'cm',
  orientation: 'Landscape',
  sideMode: '1 Sisi',
  bleed: '2 mm',
  customBleed: 2,
  corner: 'Sharp Corner',
  material: 'Art Carton 310gsm',
  finishing: 'Tanpa Finishing',
  name: '',
  jobTitle: '',
  company: '',
  tagline: '',
  logoText: '',
  industry: '',
  phone: '',
  email: '',
  website: '',
  address: '',
  instagram: '',
  tiktok: '',
  qr: false,
  style: 'Minimal Profesional',
  primaryColor: '#2563eb',
  secondaryColor: '#10b981',
  typography: 'Sans Serif Modern',
  customTypography: '',
  visualElements: '',
  mood: '',
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
    const normalized = {
      ...form,
      bleed: form.bleed === 'Custom' ? `${form.customBleed} mm` : form.bleed,
      typography: form.typography === 'Custom' ? form.customTypography : form.typography,
    };
    setPrompt(buildBusinessCardPrompt(normalized));
    setUsage(incrementDailyUsage());
    showToast?.('Prompt kartu nama berhasil dibuat.');
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
                <span className="field-label">Size preset</span>
                <select className="field" value={form.sizePreset} onChange={(event) => selectPreset(event.target.value)}>
                  {sizePresets.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <NumberField label="Width" value={form.width} onChange={(value) => setValue('width', value)} />
                <NumberField label="Height" value={form.height} onChange={(value) => setValue('height', value)} />
              </div>
              <Select label="Unit" value={form.unit} options={['cm']} onChange={(value) => setValue('unit', value)} />
              <Select label="Orientation" value={form.orientation} options={['Landscape', 'Portrait']} onChange={(value) => setValue('orientation', value)} />
              <Select label="Side mode" value={form.sideMode} options={['1 Sisi', '2 Sisi']} onChange={(value) => setValue('sideMode', value)} />
              <Select label="Bleed" value={form.bleed} options={['2 mm', '3 mm', 'Custom']} onChange={(value) => setValue('bleed', value)} />
              {form.bleed === 'Custom' ? <NumberField label="Custom bleed (mm)" value={form.customBleed} onChange={(value) => setValue('customBleed', value)} /> : null}
              <Select label="Corner" value={form.corner} options={['Sharp Corner', 'Rounded Corner']} onChange={(value) => setValue('corner', value)} />
              <Select label="Material" value={form.material} options={['Art Carton 260gsm', 'Art Carton 310gsm', 'Ivory 260gsm', 'Linen', 'BC', 'Custom']} onChange={(value) => setValue('material', value)} />
              <Select label="Finishing" value={form.finishing} options={['Tanpa Finishing', 'Laminasi Doff', 'Laminasi Glossy', 'Spot UV', 'Emboss', 'Foil Gold', 'Foil Silver']} onChange={(value) => setValue('finishing', value)} />
            </Section>

            <Section title="Identitas">
              <TextField label="Nama" value={form.name} onChange={(value) => setValue('name', value)} />
              <TextField label="Jabatan" value={form.jobTitle} onChange={(value) => setValue('jobTitle', value)} />
              <TextField label="Nama Brand / Perusahaan" value={form.company} onChange={(value) => setValue('company', value)} />
              <TextField label="Tagline" value={form.tagline} onChange={(value) => setValue('tagline', value)} />
              <TextField label="Logo text" value={form.logoText} onChange={(value) => setValue('logoText', value)} />
              <TextField label="Industry / Bidang usaha" value={form.industry} onChange={(value) => setValue('industry', value)} />
            </Section>

            <Section title="Kontak">
              <TextField label="Phone / WhatsApp" value={form.phone} onChange={(value) => setValue('phone', value)} />
              <TextField label="Email" value={form.email} onChange={(value) => setValue('email', value)} />
              <TextField label="Website" value={form.website} onChange={(value) => setValue('website', value)} />
              <TextField label="Address" value={form.address} onChange={(value) => setValue('address', value)} />
              <TextField label="Instagram" value={form.instagram} onChange={(value) => setValue('instagram', value)} />
              <TextField label="TikTok" value={form.tiktok} onChange={(value) => setValue('tiktok', value)} />
              <Toggle label="QR Code enabled" checked={form.qr} onChange={(value) => setValue('qr', value)} />
            </Section>

            <Section title="Gaya Visual">
              <Select label="Style" value={form.style} options={['Minimal Profesional', 'Corporate Clean', 'Elegant Premium', 'Bold Modern', 'Creative Designer', 'UMKM Friendly', 'Luxury Black Gold']} onChange={(value) => setValue('style', value)} />
              <ColorField label="Primary color" value={form.primaryColor} onChange={(value) => setValue('primaryColor', value)} />
              <ColorField label="Secondary color" value={form.secondaryColor} onChange={(value) => setValue('secondaryColor', value)} />
              <Select label="Typography preference" value={form.typography} options={['Sans Serif Modern', 'Serif Elegant', 'Bold Geometric', 'Rounded Friendly', 'Minimal Clean', 'Custom']} onChange={(value) => setValue('typography', value)} />
              {form.typography === 'Custom' ? <TextField label="Custom typography" value={form.customTypography} onChange={(value) => setValue('customTypography', value)} /> : null}
              <TextField label="Visual elements" value={form.visualElements} onChange={(value) => setValue('visualElements', value)} />
              <TextField label="Mood" value={form.mood} onChange={(value) => setValue('mood', value)} />
            </Section>

            <Section title="Output">
              <Select label="Platform" value={form.platform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('platform', value)} />
              <Select label="Language" value={form.language} options={['Indonesia', 'English']} onChange={(value) => setValue('language', value)} />
              <ReviewTextBox
                labelWidth="128px"
                fields={[
                  ['Nama', form.name],
                  ['Jabatan', form.jobTitle],
                  ['Brand / Perusahaan', form.company],
                  ['Tagline', form.tagline],
                  ['Phone / WhatsApp', form.phone],
                  ['Email', form.email],
                  ['Website', form.website],
                  ['Address', form.address],
                  ['Instagram', form.instagram],
                  ['TikTok', form.tiktok],
                ]}
              />
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button className="btn-primary" type="button" onClick={generate}>Generate Prompt</button>
                <button className="btn-secondary" type="button" onClick={() => { setForm(initial); setPrompt(''); }}>Reset</button>
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

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}
