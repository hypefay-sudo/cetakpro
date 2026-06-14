import { defaultNegativePrompt } from '../data/negativePrompts.js';
import { buildPremiumPromptText, cmToAr } from './promptEngine.js';

const clean = (value) => String(value ?? '').trim();

const layoutDirections = {
  'Product Catalog Grid':
    'clean structured grid, consistent spacing, readable item cards, clear product hierarchy, image-friendly blocks, balanced catalog feel',
  'Menu List':
    'menu readability first, clean price alignment, strong item separation, easy scanning, clear food/menu hierarchy',
  'Price List':
    'clean tabular rhythm, strong hierarchy for service/product name and price, organized sections, easy comparison',
  'Promo Sheet':
    'stronger highlight area, promotional emphasis, clear offer hierarchy, attention-grabbing but organized composition',
  'Collage Product':
    'more visual product layout, dynamic collage composition, organized image grouping, clear title hierarchy, still print-readable',
};

const cleanItems = (items, itemCount) => {
  const parsed = clean(items)
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  if (parsed.length) return parsed;
  return Array.from({ length: Math.max(1, Number(itemCount) || 1) }, (_, index) => `Item ${index + 1}`);
};

const textLine = (label, value) => {
  const text = clean(value);
  return text ? `${label}: ${text}` : null;
};

const buildTextElements = (form, items) =>
  [
    'Gunakan teks persis berikut, jangan typo, jangan ubah huruf, dan jangan menambahkan teks acak:',
    textLine('Judul', form.title),
    textLine('Brand', form.brand),
    textLine('Subtitle', form.subtitle),
    form.showFooter && clean(form.footerInfo) ? `Footer: ${clean(form.footerInfo)}` : null,
    items.length ? `Item:\n${items.map((item) => `* ${item}`).join('\n')}` : null,
  ]
    .filter(Boolean)
    .join('\n');

const platformInstruction = (form, paper) => {
  const platform = clean(form.platform);
  const width = form.orientation === 'Landscape' ? paper.height : paper.width;
  const height = form.orientation === 'Landscape' ? paper.width : paper.height;
  const ar = cmToAr(width, height);
  if (platform === 'Midjourney') {
    return `Midjourney direction: compact visual prompt for print layout, clean grid composition, strong hierarchy, image-friendly blocks, balanced spacing; text may need manual editing in design software. --ar ${ar} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Ideogram direction: emphasize exact text, readable typography, clean grid layout, no typo, no misspelling, and clear item separation.';
  }
  return 'ChatGPT Image direction: use natural detailed instruction, preserve exact text from TEXT LOCK, print-safe layout, readable hierarchy, and clear safe margin.';
};

export const buildA3Prompt = (form, paper) => {
  const title = clean(form.title);
  const brand = clean(form.brand);
  const subtitle = clean(form.subtitle);
  const footerInfo = clean(form.footerInfo);
  const layoutType = clean(form.layoutType) || 'Product Catalog Grid';
  const mood = clean(form.mood) || 'modern';
  const typography = clean(form.typography);
  const backgroundStyle = clean(form.backgroundStyle) || 'clean white background';
  const layoutDirection = layoutDirections[layoutType] || 'clean structured print layout with readable hierarchy';
  const items = cleanItems(form.items, form.itemCount);
  const paperSize = `${paper.width} x ${paper.height} cm`;
  const titlePart = title ? `dengan judul utama '${title}'` : 'dengan judul utama yang belum diisi';
  const brandPart = brand ? `untuk brand '${brand}'` : 'untuk brand yang belum diisi';
  const subtitlePart = subtitle ? `dan subjudul '${subtitle}'` : '';
  const hasFooterInfo = Boolean(form.showFooter && footerInfo);

  return buildPremiumPromptText({
    projectBrief: [
      `Brief proyek: desain layout A3 ${layoutType} ${brand ? `untuk brand '${brand}'` : 'untuk brand yang belum diisi'} dengan ${form.itemCount} item, ukuran ${paper.name} (${paperSize}) orientasi ${form.orientation}.`,
      title ? `Judul utama yang ditentukan user: '${title}'.` : null,
      subtitle ? `Subtitle yang ditentukan user: '${subtitle}'.` : null,
      'Output ditujukan sebagai arahan layout cetak yang rapi, konsisten, mudah dibaca, grid-aware, dan siap dikembangkan menjadi artwork final.',
    ]
      .filter(Boolean)
      .join(' '),
    main: [
      `Buat desain A3 custom layout ${layoutType} ukuran ${paper.name} (${paperSize}) orientasi ${form.orientation} ${brandPart} ${titlePart} ${subtitlePart}.`,
      `Gunakan format ${layoutType} dengan ${form.columns} kolom dan ${form.itemCount} item untuk kebutuhan ${layoutType.toLowerCase()}.`,
      `Komposisi harus memiliki visual impact yang tertata, hierarchy jelas, grid konsisten, area item mudah dipindai, dan ruang informasi yang tidak crowded.`,
      `Mood visual: ${mood}; layout direction: ${layoutDirection}. Hasil harus terasa komersial, mudah dibaca, dan siap produksi cetak.`,
    ].join(' '),
    visualConcept: [
      `Arah visual mengikuti ${layoutType}: ${layoutDirection}.`,
      `Mood ${mood} dipakai untuk membangun tampilan komersial yang rapi, mudah dibandingkan, dan cocok sebagai materi cetak yang dipakai untuk promosi atau informasi produk.`,
      `Gunakan background ${backgroundStyle} dengan spacing konsisten, area item yang image-friendly, dan emphasis yang membantu pembaca memahami isi dengan cepat.`,
    ].join('\n'),
    layout: [
      title ? `Tempatkan title '${title}' sebagai headline utama di area header dengan hierarchy paling kuat.` : 'Sediakan area title utama di header.',
      subtitle ? `Tempatkan subtitle '${subtitle}' di bawah title sebagai informasi pendukung yang tetap terbaca.` : null,
      brand ? `Tempatkan brand '${brand}' di area header atau pojok atas sebagai identitas yang jelas.` : null,
      `Gunakan tinggi area judul ${form.headerHeight} cm untuk judul, brand, dan subtitle.`,
      form.showFooter ? `Gunakan tinggi area bawah ${form.footerHeight} cm untuk info footer${footerInfo ? `: '${footerInfo}'` : ''}.` : 'Footer tidak perlu ditampilkan.',
      `Susun grid item ${form.columns} kolom dengan total ${form.itemCount} item, menggunakan jarak antar item ${form.gutter} cm agar jarak setiap item konsisten.`,
      'Setiap item memiliki image area/placeholder yang konsisten dan cukup besar.',
      'Tempatkan nama item di bawah/dekat area gambar dengan ukuran mudah dibaca.',
      form.showPrice ? 'Tempatkan area harga secara konsisten pada setiap item, mudah dibandingkan dan tidak menabrak nama item.' : null,
      form.showDescription ? 'Tempatkan area deskripsi sebagai teks kecil yang tetap rapi dan tidak memenuhi kartu item.' : null,
      `Gunakan margin ${form.margin} cm sebagai safe area utama di seluruh sisi kertas.`,
      'Jaga hierarchy readable, grid balanced, dan semua elemen tetap berada di dalam safe area.',
    ]
      .filter(Boolean)
      .join('\n'),
    textLock: buildTextElements({ ...form, footerInfo }, items),
    print: [
      `Ukuran kertas final: ${paperSize}.`,
      `Orientasi: ${form.orientation}.`,
      `Margin: ${form.margin} cm.`,
      `Jarak antar item: ${form.gutter} cm.`,
      `Tinggi area judul: ${form.headerHeight} cm.`,
      form.showFooter ? `Tinggi area bawah: ${form.footerHeight} cm.` : 'Footer tidak ditampilkan.',
      'Gunakan safe area yang cukup untuk title, brand, grid item, price, description, dan footer.',
      'Rekomendasikan output resolusi tinggi untuk kebutuhan cetak, detail tajam, dan teks tetap readable.',
      'Gunakan mode warna CMYK atau workflow print-ready color management.',
      'Artwork final tetap perlu dicek ulang di software desain sebelum print, termasuk ukuran kertas, margin, gutter, safe area, spelling teks, grid alignment, dan resolusi gambar.',
    ].join('\n'),
    platform: [
      platformInstruction(form, paper),
      typography ? `Preferensi tipografi: ${typography}.` : 'Preferensi tipografi: clean readable print typography.',
      `Primary color: ${form.primaryColor}. Secondary color: ${form.secondaryColor}.`,
    ].join('\n'),
    checklist: [
      '* Cek ukuran kertas',
      '* Cek spelling teks',
      '* Cek margin',
      '* Cek gutter/jarak antar item',
      '* Cek alignment grid',
      '* Cek resolusi gambar',
      '* Cek warna CMYK',
      '* Cek keterbacaan item',
      hasFooterInfo ? '* Cek footer/info bawah' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    negative: `${defaultNegativePrompt}, inconsistent grid, misaligned item cards, unreadable price, crowded catalog layout, poor print sheet spacing`,
  });
};
