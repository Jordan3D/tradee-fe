import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { ITrade } from '../../interface/Trade';
import { tradeGetApi } from '../../api/trade';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchPairsData, selectPairsMap } from '../../store/common/pairs';
import {Notes} from '../../components/Notes';
import {Tags} from './components/Tags';
import { selectUser } from '../../store/common/meta';
import { format } from 'date-fns-tz';
import { Container } from './style';

interface DataType extends ITrade {
    key: string;
}

const Trade = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams();
    const pairs = useSelector(selectPairsMap);
    const user = useSelector(selectUser);

    const [trade, setTrade] = useState<ITrade | undefined>(undefined);
    const data: DataType[] = useMemo(() => trade ? [{ key: trade.id, ...trade }] : [], [trade]);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 140,
            render: text => text ? text.toLowerCase() === 'buy' ? 'Closed short' : 'Closed long' : '',
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
            title: 'Open trade time',
            dataIndex: 'openTradeTime',
            key: 'openTradeTime',
            width: '25%',
            render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm:ss', {timeZone: `GMT${user?.config.utc}`}) : '',
        },
        {
            title: 'Close trade time',
            dataIndex: 'closeTradeTime',
            key: 'closeTradeTime',
            width: '25%',
            render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm:ss', {timeZone: `GMT${user?.config.utc}`}) : '',
        },
        {
            title: 'Position open',
            dataIndex: 'openPrice',
            key: 'openPrice',
            width: 110,
            render: text => text,
        },
        {
            title: 'Position close',
            dataIndex: 'closePrice',
            key: 'closePrice',
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
    }, [id, dispatch, updateTrade]);

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