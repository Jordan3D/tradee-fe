import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

  *::-webkit-scrollbar {
    width: 1em;
}
 
*::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px #8f9ddb4c;
    border-radius: 0.3rem;
}
 
*::-webkit-scrollbar-thumb {
  background-color: #26559483;
  outline: 1px solid slategrey;
  border: none;
  border-radius: 0.3rem;
}

span {
  white-space: pre-line;
}

 .ant-picker-cell {
   user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
 }

 .contentWrapper {
    min-height: 40rem;
    border: 1px solid #dfdcdc;

    .rdw-editor-main {
      padding: 1rem;
    }
}

 .ant-select-selection-overflow-item {
        padding: 0.4rem 0.4rem 0;
    margin-bottom: -0.2rem;
    }

  .ant-input, .ant-select, .ant-tag, .ant-select-item-option-content {
    font-size: 1.6rem;
  } 

  .ant-select-clear {
    right: 0.7rem;
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