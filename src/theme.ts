import type { MantineColorsTuple } from '@mantine/core';

const brand: MantineColorsTuple = [
  '#eef7f4',
  '#dfeee9',
  '#c8e1d7',
  '#a1cfbe',
  '#78b39a',
  '#4b947e',
  '#2d7a67',
  '#1d6659',
  '#145445',
  '#0f5c4d',
];

export const theme = {
  primaryColor: 'brand',
  primaryShade: 7 as const,
  defaultRadius: 'sm',
  fontFamily: 'IBM Plex Sans, sans-serif',
  headings: {
    fontFamily: 'IBM Plex Sans, sans-serif',
    fontWeight: '600',
  },
  colors: {
    brand,
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
};

export const palette = {
  background: '#F7F7F5',
  panel: '#FFFFFF',
  border: '#E4E4DF',
  text: '#1A1A17',
  muted: '#6B6B63',
  brand: '#0F5C4D',
  success: '#2F7D4F',
  warning: '#B7791F',
  danger: '#B42318',
  info: '#2B5FA8',
};
