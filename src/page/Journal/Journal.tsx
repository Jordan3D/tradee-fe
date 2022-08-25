import qs from 'qs';
import React, { ReactElement, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainButton from '../../components/Buttons';
import { Page } from '../../components/Page';
import routes from '../../router';
import CustomCalendar from './components/Calemdar/Calendar';

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
    
`

const Calendar = styled(CustomCalendar)`
    `;

const Journal = (): ReactElement => {
    const navigate = useNavigate();

    const onAddNew = useCallback((date?: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(routes.newJournalItem(date))
    }, [navigate])

    return <Container>
        <Header>
            <MainButton className='journal' onClick={onAddNew()}>Add new item</MainButton>
        </Header>
        <Calendar onAdd={onAddNew}/>
    </Container>
}

const JournalPage = (): ReactElement => <Page isSecure><Journal /></Page>

export default JournalPage;