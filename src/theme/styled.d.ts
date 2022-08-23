import "styled-components";
import { TradeeTheme } from ".";

declare module "styled-components" {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends TradeeTheme {}
}
