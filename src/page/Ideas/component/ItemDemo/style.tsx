import styled from "styled-components";

export const Container = styled.div`
 min-height: 35rem;
 padding: 2rem;

 .section {
    margin: 1.6rem 0;
 }
`;

export const ItemTitle = styled.h2`
  font-size: 2.1rem;
  font-weight: 500;
  line-height: 3.2rem;
  color: #979797;
  padding: 1rem;
`;

export const ItemContent = styled.div`
  background: #ebebeb8b;
  border: 2px dotted #c5c5c5;
  padding: 2rem;
`;

export const ItemNotes = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px dotted pink;
  padding: 1rem;
`;

export const ItemTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px dotted #dbdb10;
  padding: 1rem;
`;

export const ItemImages = styled.div``;

export const ItemTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff258;
  padding: 0.6rem 1rem;
  color: #353535;
  font-size: 1.6rem;
  margin-left: 1rem;
  margin-bottom: 0.6rem;
  min-width: 4rem;
`;

export const ItemNote = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: pink;
  padding: 0.6rem 1rem;
  color: #353535;
  font-size: 1.6rem;
  margin-left: 1rem;
  margin-bottom: 0.6rem;
  min-width: 4rem;
`;

export const ItemImg = styled.img`
height: 40rem;
`;