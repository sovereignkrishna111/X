export const cardRadiusMap: Record<string, string> = {
  pill: 'rounded-[28px]',
  xl:   'rounded-2xl',
  lg:   'rounded-xl',
  sm:   'rounded-lg',
  none: 'rounded-none',
};

export const cardRadiusValue: Record<string, string> = {
  pill: '28px',
  xl:   '16px',
  lg:   '12px',
  sm:   '8px',
  none: '0',
};

export const avatarShapeMap: Record<string, string> = {
  circle:  'rounded-full',
  rounded: 'rounded-[22px]',
  square:  'rounded-lg',
};

export const cardRadiusOptions = [
  { id: 'pill', label: 'Pill',   icon: '⬭' },
  { id: 'xl',   label: 'Curvy',  icon: '▢' },
  { id: 'lg',   label: 'Round',  icon: '▣' },
  { id: 'sm',   label: 'Sharp',  icon: '■' },
  { id: 'none', label: 'Square', icon: '◼' },
];

export const avatarShapeOptions = [
  { id: 'circle',  label: 'Circle'  },
  { id: 'rounded', label: 'Rounded' },
  { id: 'square',  label: 'Square'  },
];

export const bgOverlayOptions = [
  { id: 'none',          label: 'None'        },
  { id: 'dark',          label: 'Dark Tint'   },
  { id: 'vignette',      label: 'Vignette'    },
  { id: 'fade',          label: 'Fade Down'   },
  { id: 'gradient-dark', label: 'Gradient'    },
  { id: 'blur',          label: 'Frosted'     },
  { id: 'grain',         label: 'Film Grain'  },
  { id: 'upper-reveal',  label: 'Upper Reveal' },
  { id: 'lower-mask',    label: 'Lower Mask'  },
  { id: 'spotlight',     label: 'Spotlight'   },
  { id: 'half-shade',    label: 'Half Shade'  },
  { id: 'diagonal',      label: 'Diagonal'    },
  { id: 'side-fade',     label: 'Side Fade'   },
  { id: 'radial-blur',   label: 'Radial Blur' },
];
