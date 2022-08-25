import { ReactElement } from 'react';
import styled from 'styled-components';
import MainButton from '../../components/Buttons';
import { Page } from '../../components/Page';

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100%;

  .buttons {
    display: flex;
    padding: 2rem 0 3rem;
  }
`;

const Wall = styled.div`
display: flex;
justify-content: center;
align-items: center;
width: 30%;
min-height: 30rem;
height: 100%;
font-size: 1.4rem;
font-weight: 700;
color: lightgray;
border: 1px dashed lightgray;
border-radius: 0.5rem;
`;

const MainContent = styled(Wall)`
  width: auto;
  margin-right: 1rem;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
`
const MainContentBottom = styled(Wall)`
  width: 100%;
  flex-grow: 1;
  flex-direction: column;
  padding: 1rem;
  `

const Main = (): ReactElement => {

  return <Container className="main_page__root">
    <MainContent>
      <div className='buttons'>
        <MainButton className='journal'>
          Add journal item
        </MainButton>
        <MainButton className='note'>
          Add note
        </MainButton>
        <MainButton className='tag'>
          Add tag
        </MainButton>
      </div>
      <MainContentBottom/>
      </MainContent>
    <Wall>
      Wall
    </Wall>
  </Container>
}

const MainPage = (): ReactElement => <Page isSecure><Main /></Page>

export default MainPage;