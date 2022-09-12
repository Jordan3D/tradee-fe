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

.trades-item {
&__root {
 display: flex;
 height: 6.5rem;
 border: 1px solid #d3d031;
 background-color: #ffffd0;
 margin-bottom: 1rem;
 box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 
 transition: 0.35s ease all;
 cursor: pointer;

 &:hover {
     border-color: #e7e421;
     background-color: #e5e5ab;
     box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
 }
 
 &:last-child {
     margin-bottom: 0;
 }
}
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