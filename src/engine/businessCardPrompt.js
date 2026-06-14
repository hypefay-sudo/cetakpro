import { buildPremiumPromptText, cmToAr } from './promptEngine.js';

const clean = (value) => String(value ?? '').trim();

const negativePrompt =
  'low quality, blurry, pixelated, wrong text, misspelled text, distorted typography, messy layout, bad composition, watermark, mockup, unreadable small text, text too close to edge, cropped text, unsafe margin, no bleed, poor business card spacing, crowded contact info, wrong card ratio, low resolution, random logo, extra text';

const styleDirections = {
  'Clean Professional':
    'clean professional identity, neat spacing, strong hierarchy, balanced whitespace, corporate-ready impression, crisp small-format typography',
  'Minimalis Modern':
    'minimal modern identity, generous whitespace, simple graphic accents, refined typography, calm professional impression',
  'Premium Elegant':
    'premium elegant identity, refined layout rhythm, subtle luxury detail, polished typography, high-end business impression',
  'Bold Corporate':
    'bold corporate identity, strong contrast, confident name hierarchy, structured contact grouping, business-focused composition',
  'Creative Colorful':
    'creative colorful identity, expressive accents, fresh visual rhythm, memorable brand feel, still clean and readable',
  'Luxury Dark':
    'luxury dark identity, premium contrast, elegant accent color, restrained graphic detail, exclusive professional mood',
};

const materialNotes = {
  'Art Carton 260gsm': 'standard kartu nama yang ringan, warna tajam, dan cocok untuk produksi digital printing harian',
  'Art Carton 310gsm': 'kartu lebih tebal dengan kesan premium, warna tajam, dan struktur cetak yang kokoh',
  Linen: 'tekstur kertas terasa elegan, hindari detail terlalu kecil agar teks tetap jelas pada permukaan bertekstur',
  Ivory: 'media putih premium dengan hasil bersih, cocok untuk desain profesional yang rapi dan elegan',
  BC: 'media kartu nama klasik yang praktis, cocok untuk desain sederhana dan informasi kontak yang jelas',
  Custom: 'sesuaikan detail produksi dengan bahan kartu yang dipilih user',
};

const finishingNotes = {
  'Tanpa Finishing': 'gunakan tampilan bersih dan detail cetak yang tetap kuat walau tanpa proses akhir tambahan',
  'Laminasi Doff': 'bangun kesan premium matte, halus, dan tidak terlalu mengilap',
  'Laminasi Glossy': 'bangun kesan cerah, bersih, dan warna lebih menonjol',
  'Spot UV': 'gunakan highlight terbatas pada logo, nama brand, atau aksen utama agar tetap elegan',
  'Rounded Corner': 'pastikan elemen penting tidak dekat sudut karena kartu akan memiliki potongan sudut membulat',
};

const textLine = (label, value) => {
  const text = clean(value);
  return text ? `${label}: ${text}` : null;
};

const buildTextLock = (form) =>
  [
    'Gunakan teks persis berikut, jangan typo, jangan ubah huruf, dan jangan menambahkan teks acak:',
    textLine('Brand', form.company),
    textLine('Name', form.name),
    textLine('Job title', form.jobTitle),
    textLine('Tagline', form.tagline),
    textLine('Phone', form.phone),
    textLine('Email', form.email),
    textLine('Website', form.website),
    textLine('Instagram', form.instagram),
    textLine('Address', form.address),
  ]
    .filter(Boolean)
    .join('\n');

const platformInstruction = (form) => {
  const platform = clean(form.platform);
  const ar = cmToAr(form.width, form.height);
  if (platform === 'Midjourney') {
    return `Midjourney direction: compact visual-heavy business card prompt, professional identity layout, premium small-format composition, clean typography hierarchy, print-safe safe area; final text may need manual editing in design software. --ar ${ar} --style raw`;
  }
  if (platform === 'Ideogram') {
    return 'Ideogram direction: emphasize exact text accuracy from TEXT LOCK, typography clarity, no typo, no misspelling, readable small text, and clean contact placement.';
  }
  return 'ChatGPT Image direction: use natural detailed instruction, preserve exact text from TEXT LOCK, print-safe layout, clear hierarchy, readable small text, and safe margin.';
};

export const buildBusinessCardPrompt = (form) => {
  const company = clean(form.company);
  const name = clean(form.name);
  const jobTitle = clean(form.jobTitle);
  const tagline = clean(form.tagline);
  const phone = clean(form.phone);
  const email = clean(form.email);
  const website = clean(form.website);
  const instagram = clean(form.instagram);
  const address = clean(form.address);
  const style = clean(form.style) || 'Clean Professional';
  const material = clean(form.material) || 'Art Carton 310gsm';
  const finishing = clean(form.finishing) || 'Tanpa Finishing';
  const typography = clean(form.typography) || 'modern sans serif';
  const visualElements = clean(form.visualElements) || 'clean identity accents';
  const designNotes = clean(form.designNotes);
  const sideMode = clean(form.sideMode) || 'Satu Sisi';
  const sizeText = `${form.width} x ${form.height} ${form.unit || 'cm'}`;
  const styleDirection = styleDirections[style] || 'clean professional business card identity';
  const materialNote = materialNotes[material] || 'media kartu nama siap cetak dengan detail yang tetap mudah dibaca';
  const finishingNote = finishingNotes[finishing] || 'sesuaikan tampilan akhir dengan proses finishing yang dipilih';
  const hasContact = Boolean(phone || email || website || instagram || address);
  const isTwoSided = sideMode === 'Dua Sisi';

  return buildPremiumPromptText({
    projectBrief: [
      `Brief proyek: desain kartu nama ukuran final ${sizeText} orientasi ${form.orientation} dengan opsi ${sideMode.toLowerCase()} ${company ? `untuk brand/perusahaan '${company}'` : 'untuk identitas brand/perusahaan'}${name ? ` dan nama '${name}'` : ''}.`,
      'Output ditujukan sebagai arahan desain identitas profesional yang siap produksi cetak, memperhatikan keterbacaan format kecil, hierarchy informasi, bleed, safe area, dan kesan bisnis yang rapi.',
    ].join(' '),
    main: [
      `Buat desain kartu nama ${form.orientation} ukuran ${sizeText} ${company ? `untuk brand '${company}'` : 'untuk brand yang belum diisi'}${name ? ` dengan nama utama '${name}'` : ''}.`,
      `Gunakan gaya ${style} dengan tampilan premium sesuai arahan: ${styleDirection}.`,
      'Desain harus menampilkan identitas profesional, tipografi kecil yang mudah dibaca, hierarchy jelas antara brand, nama, jabatan, dan kontak, serta komposisi bersih yang tidak crowded.',
      `Layout harus print-ready, sadar safe area dan bleed, cocok untuk bahan ${material}, finishing ${finishing}, dan tetap terlihat rapi pada ukuran kartu nama sebenarnya.`,
    ].join(' '),
    visualConcept: [
      `Kepribadian desain: ${styleDirection}.`,
      `Arah warna memakai warna utama ${form.primaryColor} dan warna pendukung ${form.secondaryColor} untuk membangun identitas bisnis yang konsisten, profesional, dan mudah dikenali.`,
      `Mood tipografi: ${typography}; gunakan karakter huruf yang jelas, proporsional, dan tetap terbaca pada format kecil.`,
      `Elemen gambar ${visualElements} digunakan sebagai pendukung identitas, bukan dekorasi berlebihan, sehingga kartu terasa komersial, rapi, dan mudah diingat.`,
      designNotes ? `Catatan desain dari user: '${designNotes}'.` : null,
    ]
      .filter(Boolean)
      .join('\n'),
    layout: [
      'Front side: susun brand/perusahaan, nama orang, jabatan, tagline, dan kontak dengan hierarchy yang jelas.',
      company ? `Tempatkan brand/logo area untuk '${company}' secara proporsional, jelas, dan tidak menutupi nama.` : 'Sediakan area brand/logo yang proporsional dan mudah dikenali.',
      name ? `Tempatkan nama '${name}' sebagai fokus identitas utama dengan ukuran paling dominan namun tetap elegan.` : 'Sediakan area nama sebagai fokus identitas utama.',
      jobTitle ? `Tempatkan job title '${jobTitle}' dekat nama sebagai informasi pendukung.` : null,
      tagline ? `Tempatkan tagline '${tagline}' sebagai aksen singkat yang tidak mengganggu kontak.` : null,
      hasContact ? 'Kelompokkan kontak dalam area yang bersih, mudah dipindai, dan tidak terlalu dekat tepi kartu.' : 'Sediakan area kontak yang rapi jika informasi kontak nanti ditambahkan.',
      form.qr ? 'Tempatkan QR Code pada area yang cukup besar, memiliki margin kosong di sekelilingnya, dan mudah dipindai.' : null,
      isTwoSided
        ? 'Back side: gunakan fokus brand/logo, pattern atau elemen identitas yang sederhana, serta QR Code atau website/Instagram jika tersedia.'
        : null,
      `Gunakan safe area ${form.safeArea} cm untuk menjaga teks dan logo penting tetap aman dari garis potong.`,
      `Gunakan bleed ${form.bleed} cm agar warna/background aman sampai tepi kartu setelah dipotong.`,
      'Jaga spacing konsisten, alignment rapi, dan readability pada ukuran kartu nama asli.',
    ]
      .filter(Boolean)
      .join('\n'),
    textLock: buildTextLock(form),
    print: [
      `Ukuran final kartu nama: ${sizeText}.`,
      `Orientasi: ${form.orientation}.`,
      `Sisi kartu: ${sideMode}.`,
      `Bahan kartu: ${material}.`,
      `Finishing / proses akhir: ${finishing}.`,
      `Area lebih cetak / bleed: ${form.bleed} cm.`,
      `Area aman teks / safe area: ${form.safeArea} cm.`,
      `Catatan bahan: ${materialNote}.`,
      `Catatan finishing: ${finishingNote}.`,
      'Gunakan workflow warna CMYK atau print-ready color management, resolusi tinggi, dan detail tajam.',
      'Artwork final harus dicek ulang di software desain sebelum produksi, termasuk ukuran final, bleed, safe area, spelling teks, alignment, dan keterbacaan teks kecil.',
      form.qr ? 'Lakukan QR scan check pada artwork final untuk memastikan QR Code terbaca setelah ukuran cetak ditentukan.' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    platform: platformInstruction(form),
    checklist: [
      '* Cek ukuran final kartu nama',
      '* Cek spelling teks',
      '* Cek safe area',
      '* Cek bleed',
      '* Cek keterbacaan teks kecil',
      '* Cek warna CMYK',
      '* Cek resolusi',
      '* Cek posisi kontak',
      form.qr ? '* Cek QR code' : null,
      isTwoSided ? '* Cek layout sisi belakang' : null,
    ]
      .filter(Boolean)
      .join('\n'),
    negative: negativePrompt,
  });
};
