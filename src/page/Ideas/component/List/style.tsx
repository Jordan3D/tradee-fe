import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";

export const ItemContainer = styled.div`
position: relative;
display: flex;
justify-content: center;
    height: 16rem;
    border-color: transparent;
    border-width: 0.2rem;
    border-style: solid;
    background-color: #e9f2ff;
    margin-bottom: 1rem;
    box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
    transition: 0.35s ease all;
    cursor: pointer;
    padding: 0.6rem;
    overflow: hidden;

    &:hover {
        border-color: #67a2ee;
        border-radius: 0.4rem;
        background-color: #bed9fd;
        box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 

        .on-hover {
            display: flex;
            align-items: flex-end;
            padding-bottom: 3rem;
        }

        .title {
            color: white;
        }
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

    .search-item {
        padding-top: 2rem;
        width: 40rem;
    }

    .other-items {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex-grow: 1;
    }

    .filters {
        display: flex;
        flex-grow: 1;
        margin-left: 4rem;
    }

    .filter-item {
        width: 40rem;
        display: flex;
        flex-direction: column;
        padding: 0.6rem 1.6rem;
    }

.container {
  width: 100%;
  height: 100%;
  padding: 2rem;
}

.top {
    display: flex;
    height: 15rem;
    width: 100%;
}

.list {
    width: 100%;
    height: calc(100% - 16rem);
    margin-top: 2rem;
    // overflow-y: scroll;
}

.item {
  display: inline-block;
  width: 20rem;
  opacity: 1;
}
`;

export const ItemTitle = styled.div`
position: relative;
    text-align: center;
    font-size: 1.4rem;
    line-height: 1.5rem;
    font-weight: 500;
    margin-bottom: 1rem;
    z-index: 2;
`

export const ItemContent = styled.div`
    font-size: 1.4rem;
`

export const ItemFilterTitle = styled.h3`
     font-size: 1.6rem;
     line-height: 2.2rem;
     margin-bottom: 0;
    line-height: 2.2rem;
    margin-bottom: 0;
    padding-left: 0.6rem;
    color: #273b48;
`

export const ItemHover = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.10);
    justify-content: space-evenly;
    align-items: center;
    z-index: 1;
    padding-top: 2rem;

    .icon {
        &:hover {
            color: darkblue;
        }
    }
`

export const  ItemOpen = styled(EyeOutlined)`
    font-size: 3rem;
    color: green;
`

export const ItemEdit = styled(EditOutlined)`
     font-size: 3rem;
     color: orange;
`