import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainButton from '../../components/Buttons';
import { Page } from '../../components/Page';
import routes from '../../router';

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
font-size: 1.6rem;
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
  padding: ${props => props.theme.padding};
`
const MainContentBottom = styled(Wall)`
  width: 100%;
  flex-grow: 1;
  flex-direction: column;
  padding: 1rem;
  `

const Main = (): ReactElement => {
  const navigate = useNavigate();

  const onAddItem = () => {
    navigate(routes.journalItem('new'));
  };

  const onAddNote = () => {
    navigate(routes.notesItem('new'));
  };

  const onAddTag = () => {
    navigate(routes.tagsItem('new'));
  };

  return <Container className="main_page__root">
    <MainContent>
      <div className='buttons'>
        <MainButton className='journal' onClick={onAddItem}>
          Add journal item
        </MainButton>
        <MainButton className='note' onClick={onAddNote}>
          Add note
        </MainButton>
        <MainButton className='tag' onClick={onAddTag}>
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