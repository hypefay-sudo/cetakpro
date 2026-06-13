import { defaultNegativePrompt } from '../data/negativePrompts.js';
import { buildPromptText, cmToAr } from './promptEngine.js';

export const getBannerRatioStatus = (width, height) => {
  const longSide = Math.max(Number(width) || 0, Number(height) || 0);
  const shortSide = Math.max(1, Math.min(Number(width) || 0, Number(height) || 0));
  const ratio = longSide / shortSide;
  if (ratio <= 3) return { ratio, label: 'Aman', tone: 'green' };
  if (ratio <= 5) return { ratio, label: 'Wide Banner', tone: 'blue' };
  if (ratio <= 7) return { ratio, label: 'Ekstrem', tone: 'amber' };
  return { ratio, label: 'Sangat Ekstrem', tone: 'red' };
};

const clean = (value) => String(value ?? '').trim();

const themeDirections = {
  'Modern & Profesional':
    'clean corporate composition, strong hierarchy, modern geometric graphic accents, blue-dominant color balance, neat spacing, high contrast, professional printing/promo mood, readable typography, not too crowded',
  'Promo Cerah':
    'energetic promo composition, bright color contrast, bold sale-focused hierarchy, attention-grabbing headline area, dynamic shapes, clear CTA, festive but still organized and readable',
  Corporate:
    'formal business composition, trustworthy premium tone, clean grid alignment, restrained color contrast, elegant spacing, professional typography, strong brand credibility',
  Minimalis:
    'generous whitespace, simple visual elements, elegant typography, limited color palette, refined hierarchy, clean background, calm premium presentation',
  Futuristik:
    'modern futuristic composition, controlled gradients, subtle glow accents, dynamic lines, tech-inspired shapes, sharp typography, high contrast without visual clutter',
  Sekolah:
    'educational and friendly composition, institutional feel, clean information hierarchy, approachable colors, student/school visual cues, readable typography for public information',
  'Food Promo':
    'appetizing product-focused composition, warm color accents, strong food/product visual area, inviting promo mood, clear offer hierarchy, readable CTA and contact information',
};

const textLine = (label, value) => {
  const text = clean(value);
  return text ? `${label}: ${text}` : null;
};

const buildTextElements = (form) =>
  [
    'Gunakan teks persis berikut, jangan typo, jangan ubah huruf, dan jangan menambahkan teks acak:',
    textLine('Brand', form.brand),
    textLine('Headline', form.headline),
    textLine('Subheadline', form.subheadline),
    textLine('CTA', form.cta),
    textLine('WhatsApp', form.phone),
    textLine('Website', form.website),
    textLine('Alamat', form.address),
  ]
    .filter(Boolean)
    .join('\n');

const platformInstruction = (form) => {
  const platform = clean(form.platform);
  const ar = cmToAr(form.width, form.height);
  if (platform === 'Midjourney') {
    return `Midjourney direction: compact commercial banner visual prompt, strong composition, readable hierarchy, print-safe safe area, clear concept/background, balanced graphic layout; final text may need manual editing in design software. --ar ${ar} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Ideogram direction: gunakan exact text, readable typography, no typo, no misspelling, clean text placement, strong letter clarity, dan semua teks berada di dalam safe area.';
  }
  return 'ChatGPT Image direction: gunakan instruksi natural yang detail, tekankan exact text sesuai TEXT ELEMENT, print-safe layout, hierarchy jelas, safe margin cukup, dan komposisi siap dikembangkan menjadi artwork produksi.';
};

export const buildBannerPrompt = (form) => {
  const ratio = getBannerRatioStatus(form.width, form.height);
  const extreme = ratio.ratio > 5;
  const brand = clean(form.brand);
  const headline = clean(form.headline);
  const subheadline = clean(form.subheadline);
  const cta = clean(form.cta);
  const phone = clean(form.phone);
  const website = clean(form.website);
  const address = clean(form.address);
  const audience = clean(form.audience) || 'umum';
  const visualElements = clean(form.visualElements) || 'clean graphic shapes';
  const theme = clean(form.theme) || 'Modern & Profesional';
  const themeDirection = themeDirections[theme] || 'clean professional print layout';
  const contactExists = Boolean(phone || website || address);
  const mainSubject = headline || brand || 'promosi utama';
  const orientation = clean(form.orientation) || 'Horizontal';
  const orientationText = orientation.toLowerCase();
  const sizeText = `${form.width} x ${form.height} cm`;
  const brandText = brand ? `untuk brand '${brand}'` : 'untuk brand yang belum diisi';
  const headlineText = headline ? `dengan headline utama '${headline}'` : `dengan fokus pesan '${mainSubject}'`;
  const contactTargets = [
    phone ? 'WhatsApp' : null,
    website ? 'website' : null,
    address ? 'alamat' : null,
  ]
    .filter(Boolean)
    .join(', ');
  const extremeNote = extreme
    ? ' Ini adalah extreme wide banner; gunakan AI terutama untuk konsep/background composition, jaga teks minimal dan besar, lalu refine layout teks final secara manual di software desain.'
    : '';

  return buildPromptText({
    main: [
      `Buat desain banner/spanduk ${orientationText} ukuran final ${sizeText} ${brandText} ${headlineText}.`,
      `Gunakan gaya ${theme}, komposisi bersih, hierarchy kuat, kontras jelas, dan layout yang mudah dibaca dari jarak jauh.`,
      `Desain ditujukan untuk audience ${audience}, memakai arahan visual ${visualElements}, dengan mood visual: ${themeDirection}.`,
      `Desain harus memiliki area teks aman, tetap seimbang, tidak terlalu padat, dan siap dikembangkan menjadi artwork final untuk produksi cetak.${extremeNote}`,
    ].join(' '),
    layout: [
      `Logo/brand ${brand ? `'${brand}'` : 'ditempatkan'} di area kiri atas atau kiri utama dengan ukuran proporsional, jelas, dan tidak terlalu dekat tepi.`,
      `Headline ${headline ? `'${headline}'` : 'utama'} menjadi fokus visual terbesar, ditempatkan di area tengah-kiri atau pusat yang paling mudah dibaca dari jarak jauh.`,
      subheadline ? `Subheadline '${subheadline}' ditempatkan dekat headline sebagai informasi pendukung, lebih kecil, tetap kontras, dan tidak menabrak footer.` : null,
      cta ? `CTA '${cta}' ditempatkan sebagai tombol/label visual yang mudah terlihat, berada di bawah atau samping headline, dan tidak menutupi teks utama.` : null,
      phone ? `WhatsApp '${phone}' ditempatkan di area kontak yang rapi dan mudah ditemukan.` : null,
      `Area visual/illustration '${visualElements}' ditempatkan di sisi kanan, sebagai background accent, atau sebagai elemen pendukung yang tidak mengganggu keterbacaan teks.`,
      contactExists ? `Gunakan footer/contact strip hanya untuk informasi kontak yang tersedia (${contactTargets}), dengan tinggi proporsional dan teks tetap terbaca.` : 'Tidak perlu membuat footer contact strip besar jika tidak ada informasi kontak yang diisi.',
      'Semua teks penting harus berada di dalam safe area, memiliki jarak aman dari tepi, tidak overlap, dan tidak terlalu dekat area potong/finishing.',
      'Komposisi harus tetap balanced, rapi, dan readable walaupun digunakan sebagai banner cetak ukuran besar.',
      extreme ? 'Untuk rasio ekstrem, gunakan layout strip yang minimal: headline besar, teks pendukung singkat, kontak kecil, dan ruang kosong cukup untuk editing manual.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    print: [
      `Ukuran final ${sizeText} dengan orientasi ${orientationText}.`,
      `Gunakan media ${form.material}, finishing ${form.finishing}, dan bleed ${form.bleed} cm.`,
      'Pastikan tersedia safe area yang cukup agar teks, logo, CTA, dan kontak tidak terlalu dekat tepi atau area finishing.',
      'Rekomendasikan output resolusi tinggi untuk kebutuhan cetak besar, detail tajam, garis bersih, dan elemen visual tidak blur.',
      'Gunakan mode warna CMYK atau workflow print-ready yang sesuai untuk produksi digital printing.',
      'Artwork final tetap perlu dicek ulang di software desain sebelum produksi, termasuk ukuran final, bleed, safe area, resolusi, spelling teks, dan posisi kontak.',
    ].join('\n'),
    text: buildTextElements({ brand, headline, subheadline, cta, phone, website, address }),
    style: [
      platformInstruction(form),
      `Theme direction untuk ${theme}: ${themeDirection}.`,
      `Gunakan primary color ${form.primaryColor} sebagai warna aksen utama dengan kontras yang cukup untuk teks penting.`,
      `Target audience: ${audience}; desain harus terasa relevan, profesional, dan mudah dipahami oleh audience tersebut.`,
      `Visual elements: ${visualElements}; jadikan sebagai pendukung komposisi, bukan elemen yang membuat layout ramai.`,
      'Typography harus readable, hierarchy jelas, spacing rapi, dan tidak terlalu crowded.',
      extreme ? 'Extreme banner handling: fokus pada background/concept composition, safe text zones, teks minimal dan besar, serta layout yang mudah diedit ulang.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    negative: defaultNegativePrompt,
  });
};
