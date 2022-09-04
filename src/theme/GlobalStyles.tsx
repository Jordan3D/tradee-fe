import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
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