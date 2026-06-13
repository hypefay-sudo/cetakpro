export const paperSizes = [
  {
    id: 'a3plus-konica',
    name: 'A3+ Konica Minolta',
    width: 32.5,
    height: 48.5,
    unit: 'cm',
    defaultMargins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
    machineNote: 'Preset area efektif untuk mesin Konica Minolta.',
  },
  {
    id: 'a3plus-fuji',
    name: 'A3+ Fuji Xerox',
    width: 32,
    height: 48,
    unit: 'cm',
    defaultMargins: { top: 0.5, bottom: 0.5, left: 1, right: 1 },
    machineNote: 'Preset area efektif untuk mesin Fuji Xerox.',
  },
  {
    id: 'a3plus',
    name: 'A3+ Legacy / Potong Mesin MAX',
    width: 30.2,
    height: 46,
    unit: 'cm',
    defaultMargins: { top: 1.25, bottom: 1.25, left: 1.25, right: 1.25 },
  },
  { id: 'a3', name: 'A3', width: 29.7, height: 42, unit: 'cm', defaultMargins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 } },
  { id: 'a4', name: 'A4', width: 21, height: 29.7, unit: 'cm', defaultMargins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 } },
  { id: 'f4', name: 'F4', width: 21.5, height: 33, unit: 'cm', defaultMargins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 } },
  { id: 'custom', name: 'Custom', width: 0, height: 0, unit: 'cm', defaultMargins: { top: 0, bottom: 0, left: 0, right: 0 } },
];

export const getPaperSize = (id) => paperSizes.find((paper) => paper.id === id) || paperSizes[0];
