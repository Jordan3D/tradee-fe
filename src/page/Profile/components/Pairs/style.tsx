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


export const FormFooter = styled.div`
    padding: 1rem;
`