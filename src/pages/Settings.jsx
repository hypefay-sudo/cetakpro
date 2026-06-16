import { useState } from 'react';
import { paperSizes } from '../data/paperSizes';
import { futurePresets, presets } from '../data/presets';
import { getSettings, resetLocalData, saveSettings } from '../utils/storage';

export default function Settings({ showToast }) {
  const [settings, setSettings] = useState(getSettings());
  const setValue = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const save = () => {
    saveSettings(settings);
    showToast?.('Settings tersimpan.');
  };
  const reset = () => {
    if (!window.confirm('Reset local data CetakPro?')) return;
    resetLocalData();
    showToast?.('Local data direset.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Settings</h1>
        <p className="mt-1 text-slate-600">Atur default output, preset dasar, dan data lokal.</p>
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Default platform" value={settings.defaultPlatform} options={['ChatGPT Image', 'Midjourney', 'Ideogram']} onChange={(value) => setValue('defaultPlatform', value)} />
            <Select label="Default language" value={settings.defaultLanguage} options={['Indonesia', 'English']} onChange={(value) => setValue('defaultLanguage', value)} />
            <Select label="Default paper size" value={settings.defaultPaperSize} options={paperSizes.map((paper) => paper.id)} onChange={(value) => setValue('defaultPaperSize', value)} />
            <NumberField label="Default margin" value={settings.defaultMargin} onChange={(value) => setValue('defaultMargin', value)} />
            <NumberField label="Default bleed" value={settings.defaultBleed} onChange={(value) => setValue('defaultBleed', value)} />
            <Select label="Theme preference" value={settings.theme} options={['Light', 'System']} onChange={(value) => setValue('theme', value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary" type="button" onClick={save}>Save Settings</button>
            <button className="btn-secondary" type="button" onClick={reset}>Reset local data</button>
          </div>
        </section>
        <aside className="space-y-4">
          <section className="panel p-5">
            <h2 className="text-base font-bold text-slate-950">App info</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">CetakPro · Layout Calculator & Print Prompt Generator</p>
            <p className="mt-1 text-sm text-slate-500">by FRL DVSN</p>
            <p className="mt-4 text-xs text-slate-400">© 2026 CetakPro. All rights reserved.</p>
          </section>
          <section className="panel p-5">
            <h2 className="text-base font-bold text-slate-950">Preset v1</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-600">
              <PresetLine label="Banner" items={presets.banner} />
              <PresetLine label="Stiker / Label" items={presets.sticker} />
              <PresetLine label="A3" items={presets.a3} />
            </div>
          </section>
          <section className="panel p-5">
            <h2 className="text-base font-bold text-slate-950">Roadmap v1.1</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {futurePresets.map((item) => <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">{item} locked</span>)}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <select className="field" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <label>
      <span className="field-label">{label}</span>
      <input className="field" type="number" min="0" step="0.1" value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} />
    </label>
  );
}

function PresetLine({ label, items }) {
  return (
    <div>
      <p className="font-semibold text-slate-800">{label}</p>
      <p>{items.join(', ')}</p>
    </div>
  );
}
