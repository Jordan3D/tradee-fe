import { Button, Modal } from 'antd';
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainButton from '../../components/Buttons';
import { Page } from '../../components/Page';
import { IJournalItem, IJournalItemFull } from '../../interface/Journal';
import routes from '../../router';
import { JournalContext } from '../../state/journalContext';
import { fromListToDatesMap } from '../../utils/common';
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

const Grid = styled.div`
  display  : grid;
  grid-template-columns: auto auto auto;
`;

const GridItem = styled(Button)`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 14rem;
   height: 8rem;
   border: 1px solid gray;
   font-size: 1.2rem;
   font-weight: 600;
`;

const Journal = (): ReactElement => {
    const navigate = useNavigate();
    const { data, journalDataHandler } = useContext(JournalContext);
    const [dates, setDates] = useState<Readonly<{ startDate: number, endDate: number }> | undefined>(undefined);
    const [mode, setMode] = useState<'month' | 'year'>('month');
    const [chosen, setChosen] = useState<IJournalItemFull[] | undefined>(undefined);

    const calendarData = useMemo(() => fromListToDatesMap(data, mode), [data, mode]);

    const onSetInterval = useCallback((startDate: number, endDate: number, m: 'month' | 'year') => {
        setDates({ startDate, endDate });
        setMode(m);
    }, []);

    const onAddNew = useCallback((date?: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(routes.journalItemNew(date))
    }, [navigate]);

    const onClickCell = useCallback((n: number) => {
        setChosen(calendarData[n]);
    }, [calendarData]);

    const onItemClick = useCallback((id: string) => () => navigate(routes.journalItem(id)), [navigate]);

    useEffect(() => {
        if (dates?.startDate && dates?.endDate) {
            journalDataHandler({ startDate: dates.startDate, endDate: dates.endDate });
        }
    }, [journalDataHandler, dates?.startDate, dates?.endDate]);

    return <Container>
        <Header>
            <MainButton className='journal' onClick={onAddNew()}>Add new item</MainButton>
        </Header>
        <Calendar
            data={calendarData}
            onAdd={onAddNew}
            onSetInterval={onSetInterval}
            onDoubleClickCell={onClickCell}
        />
        <Modal width={1000} visible={!!chosen} onCancel={() => setChosen(undefined)} footer={null}>
            <Grid>
                {chosen?.map(item => <GridItem onClick={onItemClick(item.id)}>
                    {
                        (item.pnls.reduce((p, c) => p + c.pnl, 0)).toFixed(2)
                    }
                </GridItem>)}
            </Grid>
        </Modal>
    </Container>
}

const JournalPage = (): ReactElement => <Page isSecure><Journal /></Page>

export default JournalPage;