import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
display: flex;
 padding: 1rem;
 flex-direction: column;
 width: 100%;

.add_button {
 margin: 2rem;
}

table {
  font-size: 1.2rem;

  .disabled-row {
        background-color: #dcdcdc;
  pointer-events: none;
    }
}

.list {
     height: 50vw;
     overflow-y: scroll;
     padding: 1rem;
}

.table_content {
width: 100%;
margin-bottom: 1rem;
}
`;

export const Header = styled.div`
 display: flex;
 justify-content: space-between;
`;

export const Title = styled.h3`
font-size: 1.4rem;
`;

export const Sync = styled(Button)`
padding: 0.8rem 1.4rem;
width: auto;
height: auto;
display: flex;
align-items: center;

.button-text {
font-size: 1rem;
margin-right: 2rem;
}

.button-icon {
font-size: 1.2rem;
position: relative;
top: 0.2rem;
}
`

export const Delete = styled(Button)`
    padding: 0.8rem 1.6rem;
    height: auto;
    font-size: 1rem;

    &:hover {
        color: red;
        border-color: red;
    }
`

export const WarningText = styled.div`
    font-size: 1.1rem;
    color: darkred;
    padding: 0.2rem 0 1rem;
`

export const FormFooter = styled.div`
    padding: 1rem;
`