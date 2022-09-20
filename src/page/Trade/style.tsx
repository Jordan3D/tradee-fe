import styled from "styled-components";

export const Container = styled.div`
 position: relative;
 .trade{
    &__custom-info{
        display: flex;
        flex-direction: column;
        margin-top: 1rem;

        .title {
            font-weight: 500;
            padding: 1rem;
            color: white;
        }
    }
    &__notes {
        border: 0.3rem solid  pink;
        height: 20rem;    
    }
    &__tags {
        border: 0.3rem solid wheat;
        height: 10rem;  
        margin-top: 0.5rem;  
    }
}
`;