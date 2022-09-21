import { MediaQueries, Breakpoints, Spacing, Shadows, Radii, ZIndices } from "./types";

export const breakpointMap: { [key: string]: number } = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1200,
};

const breakpoints: Breakpoints = Object.values(breakpointMap).map((breakpoint) => `${breakpoint}px`);

const mediaQueries: MediaQueries = {
  xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
  sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
  md: `@media screen and (min-width: ${breakpointMap.md}px)`,
  lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
  xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
  xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
  nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,
};

export const shadows: Shadows = {
  default: (color) => `1px 2px 8px ${color}`,
  level1: (color1 = 'rgba(25, 19, 38, 0.1)', color2 = 'rgba(25, 19, 38, 0.05)') => `0px 2px 12px -8px ${color1}, 0px 1px 1px ${color2}`,
  active: (color1 = '#0098A1', color2 = '#1973ded4') => `0px 0px 0px 2px ${color1}, 0px 0px 4px 6px ${color2}`,
  success: (color1 = '#31D0AA', color2 = 'rgba(49, 208, 170, 0.2)') => `0px 0px 0px 1px ${color1}, 0px 0px 0px 4px ${color2}`,
  warning: (color1 = '#ED4B9E', color2 = 'rgba(237, 75, 158, 0.2)') => `0px 0px 0px 1px ${color1}, 0px 0px 0px 4px ${color2}`,
  focus: (color1 = '#2C89FF', color2 = 'rgba(44, 137, 255, 0.6)') => `0px 0px 0px 1px ${color1}, 0px 0px 0px 4px ${color2}`,
  slider: (color1 = '#A9CFFF') => `0px 0px 0px 6.66px ${color1}`,
  inset: (color1 = 'rgba(74, 74, 104, 0.1)') => `inset 0px 2px 2px -1px ${color1}`,
  tooltip: (color1 = 'rgba(0, 0, 0, 0.2)', color2 = 'rgba(14, 14, 44, 0.1)') => `0px 0px 2px ${color1}, 0px 4px 12px -8px ${color2}`,
  button: (color1 = '#8ebef878') => `6px 3px 9px 2px ${color1}`
};

const spacing: Spacing = [0, 4, 8, 16, 24, 32, 48, 64];

const radii: Radii = {
  small: "4px",
  default: "16px",
  card: "4px",
  circle: "50%",
};

const zIndices: ZIndices = {
  ribbon: 9,
  dropdown: 10,
  modal: 100,
};

const result = {
  siteWidth: 1200,
  border: {
    width: '0.2rem',
    color: 'black'
  },
  padding: '1.6rem',
  breakpoints,
  mediaQueries,
  spacing,
  shadows,
  radii,
  zIndices,
  fontSize: {
    itemTitle: '2rem',
    formItemTitle: '1.6rem'
  }
};

export default result;
