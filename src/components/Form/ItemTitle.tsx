import styled from "styled-components";

const ItemTitle = styled.div`
  font-size: ${props => props.theme.fontSize.itemTitle};
  font-weight: 500;
  height: 3rem;
  color: black;
  margin-bottom: 1.6rem;
`;

export default ItemTitle;