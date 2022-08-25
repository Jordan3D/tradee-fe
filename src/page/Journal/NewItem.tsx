import { Button, Modal } from 'antd';
import qs from 'qs';
import { format } from 'date-fns';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { Pnl } from './components/Pnl';
import { Table } from '../Trades/component/Table';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { GlobalContext } from '../../state/context';
import { NotesContext } from '../../state/notePageContext';
import { fetchPairsData } from '../../store/common/pairs';
import { fetchTradeData } from '../../store/trades';
import { selectJIDate, setJournalItemDate } from '../../store/journalItem';
import { useSelector } from 'react-redux';

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  height: 100%;
`;

const Title = styled.div`
    display: flex;
    justify-content: center;
    font-size: 1.4rem;
    font-weight: 500;
    height: 3rem;
    color: black;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    color: lightgray;
    border: 1px dashed lightgray;
    border-radius: 0.5rem;
`;

const FormItem = styled.div`
     display: flex;
     flex-direction: column;
     width: 100%;
     padding: 1rem;
     border-bottom: 1px solid black;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

type TJouranlParams = {
    date?: string
}

const NewJournalItem = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const { tagsListHandler, getTrades, clearTrades } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);
    const { search } = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const params: TJouranlParams = useMemo(() => qs.parse(search.substring(1)), [search]);

    const itemDate = useSelector(selectJIDate);
    const [pnls, setPnls] = useState<string[]>([]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onPnlSelected = (selected: string[]) => {
        setPnls(selected);
    }

    useEffect(() => {
        getTrades({limit: 10});
        dispatch(fetchPairsData());
        tagsListHandler();
        noteListHandler({});
        return clearTrades;
    }, [dispatch, noteListHandler, tagsListHandler, getTrades, clearTrades])

    useEffect(() => {
        if(params.date){
            dispatch(setJournalItemDate(new Date(params.date).toISOString()));
        }
    }, [dispatch, params.date]);

    return <Container>
        <Title>New Item ({format(new Date(itemDate), 'MMMM dd yyyy')})</Title>
        <Form>
            <FormItem>
                <Header>
                    <Title>Pnl</Title>
                    <Button onClick={showModal}>Add</Button>
                </Header>
                <Pnl tradeIds={pnls} />
                {isModalVisible && <Modal width={1500} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <Table onSelected={onPnlSelected} selected={pnls}/>
                </Modal>}
            </FormItem>
        </Form>
    </Container>
}

const NewJournalItemPage = (): ReactElement => <Page isSecure><NewJournalItem /></Page>

export default NewJournalItemPage;