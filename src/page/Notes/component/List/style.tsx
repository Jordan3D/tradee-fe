import styled from "styled-components";

export const ItemContainer = styled.div`

display: flex;
justify-content: center;
    height: 15rem;
    border: 1px solid #d3d031;
    background-color: #fddae9;
    margin-bottom: 1rem;
    box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 
    transition: 0.35s ease all;
    cursor: pointer;
    padding: 0.6rem;
    overflow: hidden;

    &:hover {
        border-color: #e7e421;
        background-color: #fddae9;
        box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
    }
    
    &:last-child {
        margin-bottom: 0;
    }
`;

export const Container = styled.div`

    display: flex;
    padding: 1rem;
    flex-direction: column;
    align-items: center;
    width: 100%;

    .seatch {
        height: 3rem;
        flex-shrink: 0;
    }

    .add_button {
        margin: 2rem;
        flex-shrink: 0;
        height: 4rem;
        font-size: 1.4rem;
        font-weight: 400;
        width: 20rem;
    }

    .container {
  width: 100%;
  height: 40rem;
}

.list {
    width: 100%;
}

.item {
  display: inline-block;
  width: 36 rem;
  opacity: 1;
}
`;

export const ItemTitle = styled.div`
    text-align: center;
    font-size: 1.4rem;
    font-weight: 500;
    margin-bottom: 1rem;
`

export const ItemContent = styled.div`
    font-size: 1rem;
`