import { defaultNegativePrompt } from '../data/negativePrompts.js';
import { buildPromptText, cmToAr } from './promptEngine.js';

const clean = (value) => String(value ?? '').trim();

const styleDirections = {
  Premium: 'elegant, clean, high contrast, refined typography, luxury packaging mood, balanced spacing, polished product presentation',
  Minimalis: 'lots of whitespace, simple layout, clear hierarchy, modern typography, restrained graphic elements, clean packaging feel',
  Cute: 'playful, soft shapes, friendly colors, rounded elements, approachable typography, cheerful packaging mood',
  Natural: 'earthy colors, organic accents, natural texture, warm packaging feel, calm composition, handcrafted product mood',
  Modern: 'clean geometric layout, sharp spacing, contemporary typography, crisp visual hierarchy, fresh retail packaging style',
  Bold: 'strong contrast, large product name, high impact, energetic composition, confident typography, attention-grabbing shelf presence',
};

const materialNotes = {
  'Vinyl Transparent': 'transparent label style, avoid too many white background blocks, use clean shapes and strong readable text contrast',
  Kraft: 'natural paper texture, earthy palette, organic packaging mood, ink-friendly details, warm handcrafted feel',
  'Vinyl White': 'solid clean printable base, crisp colors, strong contrast, reliable digital print readability',
  Chromo: 'economical packaging label, clean readable print, simple color blocking, clear product hierarchy',
  Bontax: 'economical packaging label, clean readable print, practical production layout, clear product information',
};

const textLine = (label, value) => {
  const text = clean(value);
  return text ? `${label}: ${text}` : null;
};

const buildTextElements = (form) =>
  [
    'Gunakan teks persis berikut, jangan typo, jangan ubah huruf, dan jangan menambahkan teks acak:',
    textLine('Brand', form.brand),
    textLine('Product', form.productName),
    textLine('Variant', form.variant),
    textLine('Description', form.description),
    textLine('Weight/Volume', form.weight),
    textLine('Composition', form.composition),
    textLine('Expired Date', form.expiredDateText),
    textLine('Social Media', form.socialMedia),
    textLine('Legal Info', form.legalInfo),
  ]
    .filter(Boolean)
    .join('\n');

const platformInstruction = (form) => {
  const platform = clean(form.platform);
  const ar = cmToAr(form.width, form.height);
  if (platform === 'Midjourney') {
    return `Midjourney direction: compact product label visual prompt, clear packaging hierarchy, cutline-aware composition, print-safe safe area, premium product presentation; final text may need manual editing. --ar ${ar} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Ideogram direction: gunakan exact text, readable typography, no typo, no misspelling, clean text placement, and strong letter clarity inside the safe area.';
  }
  return 'ChatGPT Image direction: gunakan instruksi natural yang detail, tekankan exact text sesuai TEXT ELEMENT, print-safe label layout, clear hierarchy, cutline-aware spacing, and safe margin cukup.';
};

export const buildStickerPrompt = (form) => {
  const brand = clean(form.brand);
  const productName = clean(form.productName);
  const variant = clean(form.variant);
  const description = clean(form.description);
  const weight = clean(form.weight);
  const style = clean(form.style) || 'Minimalis';
  const material = clean(form.material) || 'Vinyl White';
  const usage = clean(form.usage) || 'Packaging';
  const visualElements = clean(form.visualElements) || 'product visual accent';
  const typography = clean(form.typography) || 'readable packaging typography';
  const styleDirection = styleDirections[style] || 'clean readable packaging label composition';
  const materialNote = materialNotes[material] || 'print-ready label material, clean readable text, and production-safe finishing';
  const sizeText = `${form.width} x ${form.height} ${form.unit}`;
  const brandPart = brand ? `untuk brand '${brand}'` : 'untuk brand yang belum diisi';
  const productPart = productName ? `dan produk '${productName}'` : 'dan produk yang belum diisi';
  const variantPart = variant ? ` varian '${variant}'` : '';

  return buildPromptText({
    main: [
      `Buat desain stiker/label produk ukuran ${sizeText} berbentuk ${form.shape} ${brandPart} ${productPart}${variantPart}.`,
      `Gunakan gaya ${style}, tampilan ${styleDirection}, material ${material}, dan penggunaan ${usage}.`,
      'Desain harus mudah dibaca pada ukuran label sebenarnya, memiliki hierarchy produk yang jelas, dan siap dikembangkan menjadi artwork final untuk produksi cetak dan cutting.',
    ].join(' '),
    layout: [
      brand ? `Tempatkan brand '${brand}' di area atas atau area utama yang mudah dikenali.` : 'Sediakan area brand di bagian atas atau area utama label.',
      productName ? `Tempatkan product name '${productName}' sebagai fokus terbesar dengan hierarchy paling kuat.` : 'Sediakan area product name sebagai fokus terbesar.',
      variant ? `Tempatkan variant '${variant}' dekat nama produk sebagai informasi pendukung.` : null,
      description ? `Tempatkan description singkat sebagai teks pendukung yang tetap terbaca: '${description}'.` : null,
      weight ? `Tempatkan weight/volume '${weight}' di area bawah atau area informasi produk.` : null,
      `Tempatkan visual illustration '${visualElements}' sebagai elemen pendukung produk tanpa mengganggu teks utama.`,
      form.barcode ? 'Sediakan area barcode kecil di bagian bawah/samping, tidak menutupi informasi utama.' : null,
      form.qr ? 'Sediakan area QR code kecil dengan margin cukup agar mudah dipindai.' : null,
      form.expired ? 'Sediakan area Expired Date kecil dan rapi di bagian informasi produksi.' : null,
      form.legal || clean(form.legalInfo) ? 'Sediakan area legal info kecil di bagian bawah, tetap berada di safe area.' : null,
      'Tampilkan cutline/dieline sesuai bentuk label, bleed area, dan safe area dengan jelas.',
      'Jaga semua teks penting tidak terlalu dekat edge/cutline, tidak overlap, dan tetap readable.',
    ]
      .filter(Boolean)
      .join('\n'),
    print: [
      `Final label size: ${sizeText}.`,
      `Shape: ${form.shape}.`,
      `Material: ${material}.`,
      `Finishing: ${form.finishing}.`,
      `Bleed: ${form.bleed} ${form.unit}.`,
      'Sertakan cutline/dieline yang jelas, bleed area cukup, dan safe area untuk semua teks penting.',
      'Rekomendasikan output resolusi tinggi, detail tajam, dan workflow CMYK atau print-ready color management.',
      'Final artwork tetap perlu dicek ulang di software desain sebelum print/cutting, termasuk ukuran, cutline, bleed, safe area, spelling teks, barcode/QR readability, dan posisi informasi legal.',
    ].join('\n'),
    text: buildTextElements(form),
    style: [
      platformInstruction(form),
      `Style direction untuk ${style}: ${styleDirection}.`,
      `Material note untuk ${material}: ${materialNote}.`,
      `Primary color: ${form.primaryColor}. Secondary color: ${form.secondaryColor}.`,
      `Typography: ${typography}.`,
      `Visual elements: ${visualElements}.`,
      `Usage: ${usage}; pastikan desain cocok untuk konteks penggunaan tersebut.`,
    ].join('\n'),
    negative: defaultNegativePrompt,
  });
};
