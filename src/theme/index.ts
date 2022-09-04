import { TPageStyle } from "../components/Page/types";
import { TSidebarStyle } from "../components/Sidebar/types";
import { TNoteStyle } from "../page/Notes/types";
import { Breakpoints, Colors, MediaQueries, Radii, Shadows, Spacing, ZIndices } from "./types";

export interface TradeeTheme{
  colors: Colors;
  breakpoints: Breakpoints;
  mediaQueries: MediaQueries;
  spacing: Spacing;
  shadows: Shadows;
  radii: Radii;
  zIndices: ZIndices;
  sidebar: TSidebarStyle;
  page: TPageStyle;
  note: TNoteStyle;
  padding: string;
  fontSize: Record<string, string>
}

export { darkColors, lightColors } from "./colors";
export { default as dark } from "./dark";
export { default as light } from "./light";
export * from "./types";