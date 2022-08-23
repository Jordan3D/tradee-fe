import { TradeeTheme } from ".";
import base from "./base";
import { lightColors } from "./colors";

const lightTheme: TradeeTheme = {
  ...base,
  sidebar: {
    bgColor: '#a5ff1547',
    borderColor: '#0b0e1e',
    mainColor: '#ffa600d4',
    textColor: '#3f3f24'
  },
  page: {
    bgColor: '#fbfff7'
  },
  note: {},
  colors: lightColors,
};

export default lightTheme;
