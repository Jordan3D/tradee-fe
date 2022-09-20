import styled from "styled-components";

export const ItemContainer = styled.div`

position: relative;
&:hover {
    .buttons {
        display: flex;
    }
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
        margin: 4rem 2rem;
        flex-shrink: 0;
        height: 6rem;
        font-size: 1.4rem;
        font-weight: 400;
        width: 20rem;
    }

.container {
  width: 100%;
  height: 70vh;
  padding: 2rem;
}

.top {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.list {
    width: 100%;
    margin-top: 2rem;
}

.item {
  display: inline-block;
  width: 30rem;
  opacity: 1;
}
`;

export const ItemTitle = styled.div`
    position: absolute;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    font-size: 1.4rem;
    line-height: 1.5rem;
    width: 90%;
    font-weight: 500;
    margin-bottom: 1rem;
    z-index: 1;
`

export const Image = styled.img`
    position: relative;
    width: 100%;
    height: 100%;
`

export const ItemButtons = styled.div`
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
 display: none;
 width: 60%;
    justify-content: space-between;

 .button {
    font-size: 6rem;
 }
`