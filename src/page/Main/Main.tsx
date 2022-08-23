import { ReactElement } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';

const Container = styled.div`
  display: flex;
`;

const Main = (): ReactElement => {

    return  <Container className="main_page__root">

    </Container>
}

const MainPage = ():ReactElement => <Page isSecure><Main/></Page>

export default MainPage;