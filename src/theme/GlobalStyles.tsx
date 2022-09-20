import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *::-webkit-scrollbar {
    width: 1em;
}
 
*::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
}
 
*::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  outline: 1px solid slategrey;
}

  .ant-input, .ant-select, .ant-tag, .ant-select-item-option-content {
    font-size: 1.6rem;
  } 

  .ant-btn-lg {
    height: 5rem;
    padding: 1rem 3rem;
  }
  
  .ant-form-item-label {
    label {
      font-size: ${props => props.theme.fontSize.formItemTitle};
    }
  }
`;

export default GlobalStyles;