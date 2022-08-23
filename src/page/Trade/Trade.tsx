import { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Table, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation, useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { ITrade } from '../../interface/Trade';
import { tradeGetApi } from '../../api/trade';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchPairsData, selectPairsMap } from '../../store/common/pairs';
import { GlobalContext } from '../../state/context';
import { NotesContext } from '../../state/notePageContext';
import {Notes} from './components/Notes';
import {Tags} from './components/Tags';
import styled from 'styled-components';

interface DataType extends ITrade {
    key: string;
}

const Container = styled.div`
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

const Trade = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const { tagsListHandler } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);

    const { id } = useParams();
    const pairs = useSelector(selectPairsMap);

    const [trade, setTrade] = useState<ITrade | undefined>(undefined);
    const data: DataType[] = useMemo(() => trade ? [{ key: trade.id, ...trade }] : [], [trade]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 140,
            render: text => text,
        },
        {
            title: 'Pair',
            dataIndex: 'pairId',
            key: 'pairId',
            width: '15%',
            render: text => pairs[text]?.title || 'unknown',
        },
        {
            title: 'Leverage',
            dataIndex: 'leverage',
            key: 'leverage',
            width: 100,
            render: text => text,
        },
        {
            title: 'Trade time',
            dataIndex: 'tradeTime',
            key: 'tradeTime',
            width: '25%',
            render: text => text,
        },
        {
            title: 'Position open',
            dataIndex: 'open',
            key: 'open',
            width: 110,
            render: text => text,
        },
        {
            title: 'Position close',
            dataIndex: 'close',
            key: 'close',
            width: 110,
            render: text => text,
        },
        {
            title: 'Pnl',
            dataIndex: 'pnl',
            key: 'pnl',
            width: '15%',
            render: text => text,
        },
    ];

    const updateTrade = useCallback (async() => {
        if(id) {
            setTrade(await tradeGetApi(id));
        }
    }, [id, setTrade]);

    useEffect(() => {
        if (id) {
            updateTrade();
            dispatch(fetchPairsData());
        }
    }, [id, dispatch, tagsListHandler, noteListHandler, updateTrade]);

    return trade ? <Container>
        <div className='trade__values'>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                sticky
            />
        </div>
        <div className='trade__custom-info'>
            <Notes tradeId={id as string} notes={trade.notes} updateTrade={updateTrade}/>
            <Tags tradeId={id as string} tags={trade.tags} updateTrade={updateTrade}/>
        </div>
    </Container> : <></>
};

const TradePage = (): ReactElement => <Page isSecure><Trade /></Page>

export default TradePage;