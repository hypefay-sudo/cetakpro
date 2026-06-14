import { useEffect, useRef, useState } from 'react';

export default function HelpTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);

  if (!text) return null;

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[10px] font-bold text-brand-700"
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 120)}
        aria-label="Bantuan"
      >
        ?
      </button>
      <span
        className={`absolute left-1/2 top-6 z-50 w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal leading-5 text-slate-600 shadow-soft ${open ? 'block' : 'hidden'}`}
      >
        {text}
      </span>
    </span>
  );
}
