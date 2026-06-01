export const Colors = {
  // Backgrounds
  background: '#F8F7F4',
  surface: '#FFFFFF',
  surfaceRaised: '#F0EFE9',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Accent — deep indigo, intellectual + premium
  accent: '#4F46E5',
  accentSurface: '#EEF2FF',
  accentBorder: '#C7D2FE',

  // Borders & dividers
  border: '#E5E5E5',
  divider: '#F0EFF0',

  // Selected block state
  selectedBg: '#EEF2FF',
  selectedBorder: '#4F46E5',

  // Status
  errorText: '#DC2626',

  // Fixed
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Typography = {
  fontSizeXS: 11,
  fontSizeSM: 13,
  fontSizeMD: 15,
  fontSizeLG: 17,
  fontSizeXL: 22,
  fontSizeXXL: 30,
  fontSizeHero: 40,

  lineHeightBody: 26,
  lineHeightHeading: 34,

  fontWeightRegular: '400' as const,
  fontWeightMedium: '500' as const,
  fontWeightSemiBold: '600' as const,
  fontWeightBold: '700' as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;
