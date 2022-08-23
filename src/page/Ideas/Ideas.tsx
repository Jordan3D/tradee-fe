import { ReactElement } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';

const Container = styled.div`
 display: flex;
`;

const IdeasPage = (): ReactElement => {

    return <Page>
        <Container className="ideas_page__root">

        </Container>
    </Page>
}

export default IdeasPage;