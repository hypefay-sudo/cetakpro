import { useMemo, useState } from 'react';
import { exportTxt } from '../utils/exportTxt';
import { saveHistoryItem } from '../utils/storage';

const titles = [
  'PROJECT BRIEF',
  'PROMPT UTAMA',
  'KONSEP VISUAL',
  'LAYOUT & KOMPOSISI',
  'TEXT LOCK',
  'PRINT PRODUCTION DETAIL',
  'AI PLATFORM INSTRUCTION',
  'QUALITY CONTROL CHECKLIST',
  'LAYOUT INSTRUCTION',
  'PRINT DETAIL',
  'TEXT ELEMENT',
  'STYLE DIRECTION',
  'NEGATIVE PROMPT',
];

const splitPrompt = (prompt) => {
  if (!prompt) return [];
  return titles
    .map((title, index) => {
      const start = prompt.indexOf(`${title}:`);
      if (start === -1) return null;
      const nextTitle = titles.slice(index + 1).map((next) => prompt.indexOf(`${next}:`)).find((pos) => pos > start);
      const body = prompt.slice(start + title.length + 1, nextTitle || prompt.length).trim();
      return { title, body };
    })
    .filter(Boolean);
};

export default function PromptOutput({ prompt, category, title, formData, platform, language, layoutSummary, isPro, onToast }) {
  const sections = useMemo(() => splitPrompt(prompt), [prompt]);
  const [open, setOpen] = useState('PROMPT UTAMA');

  const copyPrompt = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    onToast?.('Prompt berhasil disalin');
  };

  const save = () => {
    if (!prompt) return;
    saveHistoryItem(
      {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        createdAt: new Date().toISOString(),
        category,
        title: title || category,
        prompt,
        formData,
        platform,
        language,
        layoutSummary,
      },
      isPro,
    );
    onToast?.('Prompt tersimpan ke History');
  };

  const exportPrompt = () => {
    if (!prompt) return;
    exportTxt(`${title || category}.txt`, prompt);
    onToast?.('File TXT berhasil dibuat');
  };

  return (
    <div className="panel flex min-h-[520px] flex-col overflow-hidden">
      <div className="border-b border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-950">Prompt Output</p>
        <p className="mt-1 text-xs text-slate-500">Siap copy, export, atau simpan.</p>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-4">
        {sections.length ? (
          sections.map((section) => (
            <div key={section.title} className="rounded-lg border border-slate-200 bg-slate-50">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-slate-800"
                onClick={() => setOpen(open === section.title ? '' : section.title)}
              >
                {section.title}
                <span>{open === section.title ? '-' : '+'}</span>
              </button>
              {open === section.title ? (
                <pre className="whitespace-pre-wrap px-4 pb-4 text-sm leading-6 text-slate-700">{section.body}</pre>
              ) : null}
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
            Generate prompt untuk melihat output terstruktur.
          </div>
        )}
      </div>
      <div className="grid gap-2 border-t border-slate-200 p-4 sm:grid-cols-3">
        <button className="btn-secondary" type="button" disabled={!prompt} onClick={copyPrompt}>
          Copy Prompt
        </button>
        <button className="btn-secondary" type="button" disabled={!prompt} onClick={exportPrompt}>
          Export TXT
        </button>
        <button className="btn-success" type="button" disabled={!prompt} onClick={save}>
          Save History
        </button>
      </div>
    </div>
  );
}
