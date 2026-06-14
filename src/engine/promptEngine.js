export const cmToAr = (width, height) => {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const w = Math.max(1, Math.round(Number(width) || 1));
  const h = Math.max(1, Math.round(Number(height) || 1));
  const divisor = gcd(w, h);
  return `${Math.round(w / divisor)}:${Math.round(h / divisor)}`;
};

export const section = (title, body) => `${title}:\n${body || '-'}`;

export const platformDirection = ({ platform, width, height }) => {
  if (platform === 'Midjourney') {
    return `Visual prompt compact, clean commercial design, balanced hierarchy --ar ${cmToAr(width, height)} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Prioritaskan teks akurat, huruf terbaca jelas, tipografi rapi, tanpa typo, dan komposisi mudah diedit.';
  }
  return 'Instruksi natural detail untuk membuat komposisi desain siap produksi dengan hierarchy jelas dan area teks aman.';
};

export const buildPromptText = (parts) =>
  [
    section('PROMPT UTAMA', parts.main),
    section('LAYOUT INSTRUCTION', parts.layout),
    section('PRINT DETAIL', parts.print),
    section('TEXT ELEMENT', parts.text),
    section('STYLE DIRECTION', parts.style),
    section('NEGATIVE PROMPT', parts.negative),
  ].join('\n\n');

export const buildPremiumPromptText = (parts) =>
  [
    section('PROJECT BRIEF', parts.projectBrief),
    section('PROMPT UTAMA', parts.main),
    section('KONSEP VISUAL', parts.visualConcept),
    section('LAYOUT & KOMPOSISI', parts.layout),
    section('TEXT LOCK', parts.textLock),
    section('PRINT PRODUCTION DETAIL', parts.print),
    section('AI PLATFORM INSTRUCTION', parts.platform),
    section('QUALITY CONTROL CHECKLIST', parts.checklist),
    section('NEGATIVE PROMPT', parts.negative),
  ].join('\n\n');
