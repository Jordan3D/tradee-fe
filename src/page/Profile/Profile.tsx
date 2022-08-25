import { ReactElement, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { GlobalContext } from '../../state/context';
import { Brokers } from './components/Brokers';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Main = (): ReactElement => {
  const {getBrokers} = useContext(GlobalContext);

  useEffect(() => {
    getBrokers();
  }, [getBrokers])

    return  <Container className="profile_page__root">
      <Brokers/>
    </Container>
}

const ProfilePage = ():ReactElement => <Page isSecure><Main/></Page>

export default ProfilePage;