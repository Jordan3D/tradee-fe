import { TradeeTheme } from ".";
import base from "./base";
import { darkColors } from "./colors";

const darkTheme: TradeeTheme = {
  ...base,
  sidebar: {
    bgColor: '#0082e647',
    borderColor: '#0b0e1e',
    mainColor: '#ffa600d4',
    textColor: '#3f3f24'
  },
  page: {
    bgColor: '#fbfff7',
    content : {
      padding: '2.2rem'
    }
  },
  note: {},
  colors: darkColors,
};

export default darkTheme;
