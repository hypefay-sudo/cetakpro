import { useEffect, useId, useRef, useState } from 'react';

const openEventName = 'cetakpro:tooltip-open';

export default function HelpTooltip({ text }) {
  const [open, setOpen] = useState(false);
  const [horizontal, setHorizontal] = useState('center');
  const [vertical, setVertical] = useState('above');
  const id = useId();
  const ref = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    const closeOther = (event) => {
      if (event.detail !== id) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', close);
    document.addEventListener(openEventName, closeOther);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener(openEventName, closeOther);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [id]);

  if (!text) return null;

  const show = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      if (rect.left < 150) setHorizontal('right');
      else if (window.innerWidth - rect.right < 150) setHorizontal('left');
      else setHorizontal('center');
      setVertical(rect.top < 140 ? 'below' : 'above');
    }
    document.dispatchEvent(new CustomEvent(openEventName, { detail: id }));
    setOpen(true);
  };

  const hide = () => setOpen(false);
  const toggle = () => (open ? hide() : show());
  const horizontalClass = {
    center: 'left-1/2 -translate-x-1/2',
    left: 'right-0',
    right: 'left-0',
  }[horizontal];
  const verticalClass = vertical === 'below' ? 'top-6' : 'bottom-6';

  return (
    <span ref={ref} className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      <button
        ref={buttonRef}
        type="button"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[10px] font-bold text-brand-700 transition hover:border-brand-500 hover:bg-brand-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        onClick={toggle}
        onFocus={show}
        onBlur={() => window.setTimeout(hide, 120)}
        aria-label="Bantuan"
        aria-expanded={open}
      >
        ?
      </button>
      <span
        className={`absolute ${verticalClass} ${horizontalClass} z-50 w-64 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-3 text-xs font-normal leading-5 text-slate-600 shadow-soft ${open ? 'block' : 'hidden'}`}
        role="tooltip"
      >
        {text}
      </span>
    </span>
  );
}
