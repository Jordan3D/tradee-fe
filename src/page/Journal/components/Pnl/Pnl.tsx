import { Button, Table as AntdTable, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { memo, ReactElement, useMemo } from 'react';
import { format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { selectTagMap } from '../../../../store/common/tags';
import { ITrade } from '../../../../interface/Trade';
import routes from '../../../../router';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';
import { selectJIPnls } from '../../../../store/journalItem';
import { DeleteOutlined } from '@ant-design/icons';
import {Table} from '../../../../components/Table';

interface DataType extends ITrade {
    key: string;
}

const Container = styled(Table)`
`;

const Pnl = memo(function Pnl({onRemove}: {onRemove: any}): ReactElement{
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const tagMap = useSelector(selectTagMap);
    const trades = useSelector(selectJIPnls);

    const columns: ColumnsType<DataType> = useMemo(() => [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (text, { key }) => (
                <div className='action' key={key}>
                    <Button className='action-btn' onClick={() => onRemove(key)}>
                        <DeleteOutlined/>
                    </Button>
                    <div className='action-text'>{text.toLowerCase() === 'buy' ? 'Closed short' : 'Closed long'}</div>
                </div>
            ),
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
            render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss', { timeZone: `GMT${user?.config.utc}` }),
        },
        {
            title: 'Close trade time',
            dataIndex: 'closeTradeTime',
            key: 'closeTradeTime',
            width: '25%',
            render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss', { timeZone: `GMT${user?.config.utc}` }),
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
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            width: '35%',
            render: (_, { tags }) => (
                <>
                    {tags.map(tag => {
                        return (
                            <Tag color={'yellow'} key={tag}>
                                {tagMap[tag].title}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Notes',
            key: 'notes',
            dataIndex: 'notes',
            width: '15%',
            render: notes => notes.length || '',
        }
    ], [user, pairs, tagMap, onRemove]);

    const data: DataType[] = trades.map(trade => ({ key: trade.id, ...trade }));

    const onRowChose = (trade: DataType) => () => {
        navigate(routes.trade(trade.id));
    }

    const onTableRow = (record: DataType, rowIndex: number | undefined) => {
        return {
            onDoubleClick: onRowChose(record)
        };
    }

    return <Container>
        <div className='table_content'>
            <AntdTable
                columns={columns}
                dataSource={data}
                pagination={false}
                onRow={onTableRow}
                sticky
            />
        </div>
    </Container>
});

export default Pnl;