import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainButton from '../../components/Buttons';
import { Page } from '../../components/Page';
import { IDiaryItemFull } from '../../interface/Diary';
import routes from '../../router';
import { DiaryContext } from '../../state/diaryContext';
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
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   width: 14rem;
   height: 8rem;
   border: 1px solid gray;
   font-size: 1.2rem;
   font-weight: 600;

   &:hover {
    .on-hover {
            display: flex;
            align-items: flex-end;
            padding-bottom: 1rem;
        }
   }
`;

export const ItemHover = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    display: none;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.10);
    justify-content: space-evenly;
    align-items: center;
    z-index: 1;
    padding-top: 2rem;

    .icon {
        &:hover {
            color: darkblue;
        }
    }
`

export const  ItemOpen = styled(EyeOutlined)`
    font-size: 3rem;
    color: green;
`

export const ItemEdit = styled(EditOutlined)`
     font-size: 3rem;
     color: orange;
`

const Diary = (): ReactElement => {
    const navigate = useNavigate();
    const { data, diaryDataHandler } = useContext(DiaryContext);
    const [dates, setDates] = useState<Readonly<{ startDate: number, endDate: number }> | undefined>(undefined);
    const [mode, setMode] = useState<'month' | 'year'>('month');
    const [chosen, setChosen] = useState<IDiaryItemFull[] | undefined>(undefined);

    const calendarData = useMemo(() => fromListToDatesMap(data, mode), [data, mode]);

    const onSetInterval = useCallback((startDate: number, endDate: number, m: 'month' | 'year') => {
        setDates({ startDate, endDate });
        setMode(m);
    }, []);

    const onAddNew = useCallback((date?: string) => (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(routes.diaryItemNew(date))
    }, [navigate]);

    const onClickCell = useCallback((n: number) => {
        setChosen(calendarData[n]);
    }, [calendarData]);

    const onEditHandler =  useCallback((id: string) => () => {
        navigate(routes.diaryItem(id))
    }, [navigate]);

    useEffect(() => {
        if (dates?.startDate && dates?.endDate) {
            diaryDataHandler({ startDate: dates.startDate, endDate: dates.endDate });
        }
    }, [diaryDataHandler, dates?.startDate, dates?.endDate]);

    return <Container>
        <Header>
            <MainButton className='diary' onClick={onAddNew()}>Add new item</MainButton>
        </Header>
        <Calendar
            data={calendarData}
            onAdd={onAddNew}
            onSetInterval={onSetInterval}
            onDoubleClickCell={onClickCell}
        />
        <Modal width={1000} visible={!!chosen} onCancel={() => setChosen(undefined)} footer={null}>
            <Grid>
                {chosen?.map(item => <GridItem onClick={onEditHandler(item.id)}>
                    {
                        item.title
                    }
                </GridItem>)}
            </Grid>
        </Modal>
    </Container>
}

const JournalPage = (): ReactElement => <Page isSecure><Diary /></Page>

export default JournalPage;