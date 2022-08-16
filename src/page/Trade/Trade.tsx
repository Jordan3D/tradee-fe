import './style.scss';
import { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Table, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useLocation } from 'react-router-dom';
import { Page } from '../../components/Page';
import qs from 'qs';
import { ITrade } from '../../interface/Trade';
import { tradeGetApi } from '../../api/trade';
import { useSelector } from 'react-redux';
import { selectTagMap } from '../../store/common/tags';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchPairsData, selectPairsMap } from '../../store/common/pairs';
import { GlobalContext } from '../../state/context';
import { NotesContext } from '../../state/notePageContext';

interface DataType extends ITrade {
    key: string;
}

const Trade = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const { tagsListHandler } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);

    const { search } = location;
    const { id }: { id?: string } = useMemo(() => qs.parse(search.substring(1)), [search]);
    const pairs = useSelector(selectPairsMap);
    const tagMap = useSelector(selectTagMap);


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

    const onRowChose = (trade: DataType) => () => {
        // navigate();
    }

    const onTableRow = useCallback((record: DataType, rowIndex: number | undefined) => {
        return {
            onDoubleClick: onRowChose(record)
        };
    }, [])

    useEffect(() => {
        if (id) {
            (async () => {
                setTrade(await tradeGetApi(id));
                dispatch(fetchPairsData());
                tagsListHandler();
                noteListHandler({});
            })()
        }
    }, [id, dispatch, tagsListHandler, noteListHandler]);

    return trade ? <div className='trade-page__root'>
        <div className='trade__values'>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                onRow={onTableRow}
                sticky
            />
        </div>
        <div className='trade__custom-info'>
            <div className='trade__notes'>
                NOTES
            </div>
            <div className='trade__tags'>
                Tags
            </div>
        </div>
    </div> : <></>
};

const TradePage = (): ReactElement => <Page><Trade /></Page>

export default TradePage;