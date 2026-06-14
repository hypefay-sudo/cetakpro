import { defaultNegativePrompt } from '../data/negativePrompts.js';
import { buildPremiumPromptText, cmToAr } from './promptEngine.js';

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

const foodKeywords = ['krupuk', 'kerupuk', 'kopi', 'makanan', 'minuman', 'snack', 'camilan', 'cemilan', 'food', 'drink'];

const themeDirections = {
  'Modern & Profesional':
    'clean corporate composition, strong hierarchy, modern geometric graphic accents, blue-dominant color balance, neat spacing, high contrast, professional printing/promo mood, readable typography, not too crowded',
  'Promo Cerah':
    'energetic promo composition, bright color contrast, bold sale-focused hierarchy, attention-grabbing headline area, dynamic shapes, clear action message, festive but still organized and readable',
  Corporate:
    'formal business composition, trustworthy premium tone, clean grid alignment, restrained color contrast, elegant spacing, professional typography, strong brand credibility',
  Minimalis:
    'generous whitespace, simple visual elements, elegant typography, limited color palette, refined hierarchy, clean background, calm premium presentation',
  Futuristik:
    'modern futuristic composition, controlled gradients, subtle glow accents, dynamic lines, tech-inspired shapes, sharp typography, high contrast without visual clutter',
  Sekolah:
    'educational and friendly composition, institutional feel, clean information hierarchy, approachable colors, student/school visual cues, readable typography for public information',
  'Food Promo':
    'appetizing product-focused composition, warm color accents, strong food/product visual area, inviting promo mood, clear offer hierarchy, readable action message and contact information',
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
    textLine('Ajakan / Tombol Aksi', form.cta),
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
  return 'ChatGPT Image direction: gunakan instruksi natural yang detail, tekankan exact text sesuai TEXT LOCK, print-safe layout, hierarchy jelas, safe margin cukup, dan komposisi siap dikembangkan menjadi artwork produksi.';
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
  const hasVisualElements = Boolean(clean(form.visualElements));
  const theme = clean(form.theme) || 'Modern & Profesional';
  const themeDirection = themeDirections[theme] || 'clean professional print layout';
  const contactExists = Boolean(phone || website || address);
  const foodContext = [brand, headline, subheadline, audience, visualElements]
    .join(' ')
    .toLowerCase();
  const isFoodLike = foodKeywords.some((keyword) => foodContext.includes(keyword));
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

  return buildPremiumPromptText({
    projectBrief: [
      `Brief proyek: desain banner/spanduk ${orientationText} ukuran ${sizeText} ${brand ? `untuk promosi large format brand '${brand}'` : 'untuk promosi large format'} ${headline ? `dengan headline '${headline}'` : `dengan fokus pesan '${mainSubject}'`}.`,
      `Output ditujukan sebagai arahan visual siap produksi, dengan fokus keterbacaan jarak jauh, hierarchy teks kuat, komposisi bersih, dan area aman untuk proses cetak.`,
      audience ? `Target yang ditentukan user: '${audience}'.` : null,
      extreme ? 'Catatan: banner ukuran ekstrem, AI disarankan untuk konsep/background dan safe text zone.' : null,
    ]
      .filter(Boolean)
      .join(' '),
    main: [
      `Buat desain banner/spanduk ${orientationText} ukuran final ${sizeText} ${brandText} ${headlineText}.`,
      `Gunakan gaya ${theme} dengan visual impact kuat, hierarchy promosi yang jelas, kontras tinggi, komposisi bersih, dan layout yang mudah dipahami dalam hitungan detik dari jarak jauh.`,
      `Desain harus terasa relevan untuk target '${audience}', memakai arahan visual ${visualElements}, serta menjaga mood komersial berikut: ${themeDirection}.`,
      `Hasil harus terlihat profesional, tidak crowded, memiliki area teks aman, dan siap dikembangkan menjadi artwork final untuk produksi cetak.${extremeNote}`,
    ].join(' '),
    visualConcept: [
      `Arah visual mengikuti tema ${theme}: ${themeDirection}.`,
      `Desain harus terasa relevan untuk target '${audience}', dengan pesan yang cepat ditangkap, mudah dikenali dari jauh, dan cocok untuk kebutuhan promosi cetak besar.`,
      hasVisualElements
        ? `Gunakan elemen visual ${visualElements} sebagai pendukung pesan promosi, dibuat menarik, mudah dikenali dari jauh, dan tidak memenuhi layout.`
        : `Gunakan elemen visual pendukung yang sederhana, komersial, dan tidak mengambil perhatian dari headline utama.`,
      isFoodLike ? 'Karena konteks mengarah ke produk makanan/minuman, bangun kesan appetizing, product appeal yang kuat, dan tampilan market-friendly tanpa mengubah teks user.' : null,
      `Warna utama ${form.primaryColor} dipakai sebagai aksen utama dengan kontras tinggi untuk teks penting.`,
      extreme ? 'Karena rasio ekstrem, konsep visual harus lebih fokus pada background, rhythm horizontal, dan ruang teks yang besar.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    layout: [
      `Logo/brand ${brand ? `'${brand}'` : 'ditempatkan'} di area kiri atas atau kiri utama dengan ukuran proporsional, jelas, dan tidak terlalu dekat tepi.`,
      `Headline ${headline ? `'${headline}'` : 'utama'} menjadi fokus visual terbesar, ditempatkan di area tengah-kiri atau pusat yang paling mudah dibaca dari jarak jauh.`,
      subheadline ? `Subheadline '${subheadline}' ditempatkan dekat headline sebagai informasi pendukung, lebih kecil, tetap kontras, dan tidak menabrak footer.` : null,
      cta ? `Ajakan/tombol aksi '${cta}' ditempatkan sebagai label visual yang mudah terlihat, berada di bawah atau samping headline, dan tidak menutupi teks utama.` : null,
      phone ? `WhatsApp '${phone}' ditempatkan di area kontak yang rapi dan mudah ditemukan.` : null,
      `Area visual/illustration '${visualElements}' ditempatkan di sisi kanan, sebagai background accent, atau sebagai elemen pendukung yang tidak mengganggu keterbacaan teks.`,
      contactExists ? `Gunakan footer/contact strip hanya untuk informasi kontak yang tersedia (${contactTargets}), dengan tinggi proporsional dan teks tetap terbaca.` : 'Tidak perlu membuat footer contact strip besar jika tidak ada informasi kontak yang diisi.',
      'Semua teks penting harus berada di dalam safe area, memiliki jarak aman dari tepi, tidak overlap, dan tidak terlalu dekat area potong/finishing.',
      'Komposisi harus tetap balanced, rapi, dan readable walaupun digunakan sebagai banner cetak ukuran besar.',
      extreme ? 'Untuk rasio ekstrem, gunakan layout strip yang minimal: headline besar, teks pendukung singkat, kontak kecil, dan ruang kosong cukup untuk editing manual.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    textLock: buildTextElements({ brand, headline, subheadline, cta, phone, website, address }),
    print: [
      `Ukuran final ${sizeText} dengan orientasi ${orientationText}.`,
      `Gunakan media ${form.material}, finishing ${form.finishing}, dan bleed ${form.bleed} cm.`,
      'Pastikan tersedia safe area yang cukup agar teks, logo, ajakan/tombol aksi, dan kontak tidak terlalu dekat tepi atau area finishing.',
      'Rekomendasikan output resolusi tinggi untuk kebutuhan cetak besar, detail tajam, garis bersih, dan elemen visual tidak blur.',
      'Gunakan mode warna CMYK atau workflow print-ready yang sesuai untuk produksi digital printing.',
      'Artwork final tetap perlu dicek ulang di software desain sebelum produksi, termasuk ukuran final, bleed, safe area, resolusi, spelling teks, dan posisi kontak.',
    ].join('\n'),
    platform: [
      platformInstruction(form),
      extreme ? 'Extreme banner handling: fokus pada background/concept composition, safe text zones, teks minimal dan besar, serta layout yang mudah diedit ulang.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    checklist: [
      '* Cek ukuran final',
      '* Cek spelling teks',
      '* Cek safe area',
      '* Cek bleed',
      '* Cek resolusi',
      '* Cek warna CMYK',
      '* Cek keterbacaan jarak jauh',
      contactExists ? '* Cek posisi kontak/info penting' : '* Cek posisi teks dan info penting',
    ].join('\n'),
    negative: `${defaultNegativePrompt}, poor large-format readability, unsafe banner footer, contact strip too large, headline too small`,
  });
};
