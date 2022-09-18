import styled from "styled-components";

export const ItemContainer = styled.div`

display: flex;
justify-content: center;
    height: 30rem;
    border-color: #9ac6ff;
    border-width: 0.2rem;
    border-style: dotted;
    background-color: #e9f2ff;
    margin-bottom: 1rem;
    box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
    transition: 0.35s ease all;
    cursor: pointer;
    padding: 0.6rem;
    overflow: hidden;

    &:hover {
        border-color: #67a2ee;
        border-style: solid;
        border-radius: 0.4rem;
        background-color: #bed9fd;
        box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 
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

    .add_button {
        flex-shrink: 0;
        height: 8rem;
        width: 8rem;
        margin: 2rem;
        border-radius: 50%;
        font-size: 4.4rem;
        color: #1f9f1f;
        border-color: #ddfde4;
        box-shadow: 0.3rem 0.3rem 5px 0px rgba(0, 0, 0, 0.310); 

        &:hover {
            box-shadow: 0.1rem 0.1rem 3px 0px rgba(0, 0, 0, 0.132); 
        }

        & * {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .filters {
        display: flex;
        flex-grow: 1;
        margin-left: 4rem;
    }

    .filter-item {
        width: 33%;
        display: flex;
        flex-direction: column;
        padding: 1rem 2rem;
    }

.container {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.top {
    display: flex;
    height: 13rem;
    width: 100%;
}

.list {
    width: 100%;
    height: calc(100% - 14rem);
    margin-top: 2rem;
    // overflow-y: scroll;
}

.item {
  display: inline-block;
  width: 30rem;
  opacity: 1;
}
`;

export const ItemTitle = styled.div`
    text-align: center;
    font-size: 1.8rem;
    font-weight: 500;
    margin-bottom: 1rem;
`

export const ItemContent = styled.div`
    font-size: 1.4rem;
`