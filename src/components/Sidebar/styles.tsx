import { Button } from "antd";
import styled from "styled-components";

export const Container = styled.div`
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 padding: 1rem;
 align-items: center;
 flex-shrink: 0;

 top: 0;
 left: 0;
 width: 8rem;
 height: 100vh;
 background: ${props => props.theme.sidebar.bgColor};
 border-right: 1px solid #0b0e1e;
 border-color: ${props => props.theme.sidebar.borderColor};
 position: relative;
 transition: 0.5s all ease;
 z-index: 1;

.circle-btn {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    border-width: 0;
    font-size: 1.4rem;
    background-color: #0a0a02b5;
    box-shadow: ${props => props.theme.shadows.default('#0a0a02b5')};

    &:hover {
        background-color: ${props => props.theme.sidebar.textColor};
        color: ${props => props.theme.sidebar.mainColor};
        box-shadow: ${props => props.theme.shadows.tooltip('#0a0a02b5', props.theme.sidebar.mainColor)};
    }
}

.sidebar {
    &__icon {
        position: absolute;
        right: 0;
        cursor: pointer;
        font-size: 1.4rem;
        background: transparent;
        border: none;
        color: white;
        padding: 0.5rem;
        border-radius: 20%;
        transition: 0.5s all ease;
}

&__nav {
 position: absolute;
 bottom: 0;
 padding: 0.4rem;
 height: 90%;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
}
}
`;

export const List = styled.div`
 display: flex;
 flex-direction: column;
`;

export const ItemButton = styled(Button)`
 width: 100%;
 text-transform: capitalize;
 margin-bottom: 0.5rem;
 transition: 0.5s all ease;
 background: #ffffff2e;
 color: ${props => props.theme.sidebar.textColor};
 font-size: 0.9rem;
 font-weight: 700;
 border: none;

 &:hover {
    color: black;
 }

&:last-child {
    margin-bottom: 0;
}
`;
