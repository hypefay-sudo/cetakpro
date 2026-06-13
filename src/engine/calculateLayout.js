const cleanNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const calculateVariant = ({ paperWidth, paperHeight, margins, designWidth, designHeight, gapX, gapY }) => {
  const effectiveWidth = Math.max(0, paperWidth - margins.left - margins.right);
  const effectiveHeight = Math.max(0, paperHeight - margins.top - margins.bottom);
  const columns =
    designWidth > 0 ? Math.max(0, Math.floor((effectiveWidth + gapX) / (designWidth + gapX))) : 0;
  const rows =
    designHeight > 0 ? Math.max(0, Math.floor((effectiveHeight + gapY) / (designHeight + gapY))) : 0;
  const total = columns * rows;
  const usedWidth = columns > 0 ? columns * designWidth + Math.max(0, columns - 1) * gapX : 0;
  const usedHeight = rows > 0 ? rows * designHeight + Math.max(0, rows - 1) * gapY : 0;
  return {
    columns,
    rows,
    total,
    effectiveWidth,
    effectiveHeight,
    usedWidth,
    usedHeight,
    remainingX: Math.max(0, effectiveWidth - usedWidth),
    remainingY: Math.max(0, effectiveHeight - usedHeight),
    usedArea: usedWidth * usedHeight,
  };
};

export const calculateLayout = (input) => {
  const paperWidth = cleanNumber(input.paperWidth);
  const paperHeight = cleanNumber(input.paperHeight);
  const margins = {
    top: Math.max(0, cleanNumber(input.marginTop)),
    bottom: Math.max(0, cleanNumber(input.marginBottom)),
    left: Math.max(0, cleanNumber(input.marginLeft)),
    right: Math.max(0, cleanNumber(input.marginRight)),
  };
  const designWidth = Math.max(0, cleanNumber(input.designWidth));
  const designHeight = Math.max(0, cleanNumber(input.designHeight));
  const gapX = Math.max(0, cleanNumber(input.gapX));
  const gapY = Math.max(0, cleanNumber(input.gapY));
  const normal = calculateVariant({ paperWidth, paperHeight, margins, designWidth, designHeight, gapX, gapY });
  const rotated = calculateVariant({
    paperWidth,
    paperHeight,
    margins,
    designWidth: designHeight,
    designHeight: designWidth,
    gapX,
    gapY,
  });
  const mode = input.mode || 'Otomatis Terbaik';
  let selected = normal;
  let orientation = 'Normal';
  if (mode === 'Rotasi') {
    selected = rotated;
    orientation = 'Rotasi';
  }
  if (mode === 'Otomatis Terbaik' && rotated.total > normal.total) {
    selected = rotated;
    orientation = 'Rotasi';
  }
  const biggerThanArea =
    designWidth > normal.effectiveWidth ||
    designHeight > normal.effectiveHeight ||
    (mode !== 'Normal' && designHeight > rotated.effectiveWidth && designWidth > rotated.effectiveHeight);
  const recommendation =
    selected.total === 0
      ? 'Ukuran desain belum muat di area cetak efektif. Coba perkecil desain, margin, atau gap.'
      : orientation === 'Rotasi'
        ? 'Mode rotasi memberi hasil paling efisien untuk ukuran ini.'
        : 'Mode normal sudah menjadi pilihan paling efisien untuk layout ini.';
  return {
    ...selected,
    paperWidth,
    paperHeight,
    margins,
    designWidth: orientation === 'Rotasi' ? designHeight : designWidth,
    designHeight: orientation === 'Rotasi' ? designWidth : designHeight,
    originalDesignWidth: designWidth,
    originalDesignHeight: designHeight,
    gapX,
    gapY,
    orientation,
    normal,
    rotated,
    biggerThanArea,
    recommendation,
  };
};
