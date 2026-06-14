import { defaultNegativePrompt } from '../data/negativePrompts.js';
import { buildPromptText, cmToAr } from './promptEngine.js';

const clean = (value) => String(value ?? '').trim();

const styleDirections = {
  'Minimal Profesional': 'clean layout, whitespace, clear typography, subtle accent color, professional identity, tidy contact hierarchy',
  'Corporate Clean': 'formal, trustworthy, structured, neat spacing, business-focused composition, clear company identity',
  'Elegant Premium': 'refined typography, premium spacing, subtle luxury details, elegant color balance, polished identity mood',
  'Bold Modern': 'strong contrast, modern blocks, large name hierarchy, confident visual identity, sharp layout rhythm',
  'Creative Designer': 'expressive layout, modern shapes, creative accent, portfolio-friendly identity, memorable visual detail',
  'UMKM Friendly': 'friendly, readable, accessible, clear contact information, simple branding, approachable business identity',
  'Luxury Black Gold': 'black/gold feel, premium mood, elegant serif/sans typography, luxury identity, restrained foil-like accent',
};

const materialNotes = {
  'Art Carton 260gsm': 'sharp digital print and standard business card production with reliable color readability',
  'Art Carton 310gsm': 'sharp digital print and thicker standard business card production with premium stiffness',
  Linen: 'textured paper feel; avoid overly small details so text remains readable on textured stock',
  'Ivory 260gsm': 'clean premium base, refined white tone, and strong print readability',
  BC: 'classic business card stock with simple clean production and practical readability',
};

const finishingNotes = {
  'Spot UV': 'use Spot UV as a subtle highlight for logo, name, or key accent areas only',
  Emboss: 'use emboss as a refined accent for logo or name, not across too many small elements',
  'Foil Gold': 'use gold foil as a premium accent, keep it restrained and focused on logo/name details',
  'Foil Silver': 'use silver foil as a premium accent, keep it restrained and focused on logo/name details',
};

const textLine = (label, value) => {
  const text = clean(value);
  return text ? `${label}: ${text}` : null;
};

const buildTextElements = (form) =>
  [
    'Gunakan teks persis berikut, jangan typo, jangan ubah huruf, dan jangan menambahkan teks acak:',
    textLine('Nama', form.name),
    textLine('Jabatan', form.jobTitle),
    textLine('Brand/Perusahaan', form.company),
    textLine('Tagline', form.tagline),
    textLine('Phone/WhatsApp', form.phone),
    textLine('Email', form.email),
    textLine('Website', form.website),
    textLine('Alamat', form.address),
    textLine('Instagram', form.instagram),
    textLine('TikTok', form.tiktok),
  ]
    .filter(Boolean)
    .join('\n');

const platformInstruction = (form) => {
  const platform = clean(form.platform);
  const ar = cmToAr(form.width, form.height);
  if (platform === 'Midjourney') {
    return `Midjourney direction: compact business card visual prompt, clean identity layout, readable hierarchy, print-safe safe area; text may need manual editing in design software. --ar ${ar} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Ideogram direction: emphasize exact text, readable typography, no typo, no misspelling, clean text placement, and strong contact readability.';
  }
  return 'ChatGPT Image direction: use natural detailed instruction, preserve exact text from TEXT ELEMENT, print-safe layout, readable typography, and clear safe margin.';
};

export const buildBusinessCardPrompt = (form) => {
  const name = clean(form.name);
  const jobTitle = clean(form.jobTitle);
  const company = clean(form.company);
  const tagline = clean(form.tagline);
  const industry = clean(form.industry) || 'umum';
  const style = clean(form.style) || 'Minimal Profesional';
  const material = clean(form.material) || 'Art Carton 310gsm';
  const finishing = clean(form.finishing) || 'Tanpa Finishing';
  const typography = clean(form.typography) || 'Sans Serif Modern';
  const visualElements = clean(form.visualElements) || 'clean lines';
  const mood = clean(form.mood) || 'professional';
  const styleDirection = styleDirections[style] || 'clean professional business card identity';
  const materialNote = materialNotes[material] || 'print-ready business card stock with clean readable production';
  const finishingNote = finishingNotes[finishing];
  const sideMode = clean(form.sideMode) || '1 Sisi';
  const sizeText = `${form.width} x ${form.height} ${form.unit}`;

  return buildPromptText({
    main: [
      `Buat desain kartu nama ukuran ${sizeText} orientasi ${form.orientation} untuk '${name || 'nama belum diisi'}'${company ? ` dari brand '${company}'` : ''}.`,
      `Gunakan gaya ${style} untuk bidang ${industry}, side mode ${sideMode}, dengan komposisi clean, hierarchy jelas, mudah dibaca, dan siap dikembangkan menjadi artwork final untuk produksi cetak.`,
      `Mood visual: ${mood}; arah visual: ${styleDirection}.`,
    ].join(' '),
    layout: [
      'Front side: susun nama, jabatan, brand/perusahaan, tagline, dan kontak dengan hierarchy yang rapi.',
      company ? `Tempatkan logo/brand area untuk '${company}' secara jelas tanpa mendominasi nama.` : 'Sediakan area logo/brand yang rapi dan proporsional.',
      name ? `Tempatkan nama '${name}' sebagai elemen identitas utama.` : 'Sediakan area nama sebagai elemen identitas utama.',
      jobTitle ? `Tempatkan jabatan '${jobTitle}' dekat nama sebagai informasi pendukung.` : null,
      tagline ? `Gunakan tagline '${tagline}' sebagai aksen pendek yang tidak mengganggu kontak.` : null,
      'Tempatkan kontak dalam baris/kolom yang bersih, mudah dipindai, dan tidak terlalu dekat tepi.',
      form.qr ? 'Sediakan QR code placeholder kecil dengan margin cukup agar mudah dipindai.' : null,
      sideMode === '2 Sisi' ? 'Back side: gunakan logo/brand centered atau pola brand sederhana dengan ruang kosong premium.' : null,
      'Jaga semua teks di dalam safe area, sisakan bleed, hindari teks terlalu dekat edge/cutline, dan pertahankan spacing yang clean dan balanced.',
    ]
      .filter(Boolean)
      .join('\n'),
    print: [
      `Final card size: ${sizeText}.`,
      `Orientation: ${form.orientation}.`,
      `Side mode: ${sideMode}.`,
      `Material: ${material}.`,
      `Finishing: ${finishing}.`,
      `Bleed: ${form.bleed}.`,
      `Corner type: ${form.corner}.`,
      'Gunakan safe area yang cukup untuk nama, brand, kontak, dan QR code.',
      'Rekomendasikan output resolusi tinggi, detail tajam, dan workflow CMYK atau print-ready color management.',
      finishingNote ? `Finishing note: ${finishingNote}.` : null,
      `Material note: ${materialNote}.`,
      'Artwork final tetap perlu dicek ulang di software desain sebelum print/cutting, termasuk ukuran final, bleed, safe area, spelling teks, QR readability, dan posisi cutline.',
    ]
      .filter(Boolean)
      .join('\n'),
    text: buildTextElements(form),
    style: [
      platformInstruction(form),
      `Style direction untuk ${style}: ${styleDirection}.`,
      `Material direction: ${materialNote}.`,
      finishingNote ? `Finishing direction: ${finishingNote}.` : null,
      `Primary color: ${form.primaryColor}. Secondary color: ${form.secondaryColor}.`,
      `Typography preference: ${typography}.`,
      `Visual elements: ${visualElements}.`,
      `Mood: ${mood}.`,
      'Pastikan typography readable, spacing rapi, contact information jelas, dan desain tidak terlalu crowded.',
    ]
      .filter(Boolean)
      .join('\n'),
    negative: defaultNegativePrompt,
  });
};
