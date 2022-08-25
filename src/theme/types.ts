import { DefaultTheme } from "styled-components";
import { TradeeTheme } from ".";

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  nav: string;
};

export type Spacing = number[];

export type Radii = {
  small: string;
  default: string;
  card: string;
  circle: string;
};

export type Shadows = {
  default: (c1?: string, c2?: string)=> string;
  level1: (c1?: string, c2?: string)=> string;
  active: (c1?: string, c2?: string)=> string;
  success: (c1?: string, c2?: string)=> string;
  warning: (c1?: string, c2?: string)=> string;
  focus: (c1?: string, c2?: string)=> string;
  slider: (c1?: string, c2?: string)=> string;
  inset: (c1?: string, c2?: string)=> string;
  tooltip: (c1?: string, c2?: string)=> string;
  button: (c1?: string, c2?: string) => string;
};

export type Gradients = {
  bubblegum: string;
  inverseBubblegum: string;
  cardHeader: string;
  blue: string;
  violet: string;
  violetAlt: string;
  gold: string;
};

export type Colors = {
  primary: string;
  primaryLight: string;
  primaryBright: string;
  primaryDark: string;
  secondary: string;
  tertiary: string;
  success: string;
  failure: string;
  warning: string;
  cardBorder: string;
  contrast: string;
  dropdown: string;
  dropdownDeep: string;
  invertedContrast: string;
  input: string;
  inputSecondary: string;
  inputBalance: string;
  background: string;
  backgroundDisabled: string;
  backgroundAlt: string;
  backgroundAlt2: string;
  text: string;
  textDisabled: string;
  textSubtle: string;
  textAlt?: string;
  disabled: string;
  white: string;
  checkbox: string;
  darkGray: string;

  // Gradients
  gradients: Gradients;

  // Additional colors
  binance: string;
  overlay: string;
  gold: string;
  silver: string;
  bronze: string;
};

export type ZIndices = {
  ribbon: number;
  dropdown: number;
  modal: number;
};

export type TThemes = Record<'dark' | 'light', TradeeTheme>