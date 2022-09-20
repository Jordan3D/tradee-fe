import { Button, Modal, Pagination, Table as AntdTable, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { memo, ReactElement, useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { ITransaction } from '../../../../interface/Transaction';
import routes from '../../../../router';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';
import { selectJITrasactions } from '../../../../store/journalItem';
import { DeleteOutlined } from '@ant-design/icons';
import {Table} from '../../../../components/Table';

interface DataType extends ITransaction {
    key: string;
}

const Container = styled(Table)`
    
`;

const Transactions = memo(({onRemove}: {onRemove: any}): ReactElement => {
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const transactions = useSelector(selectJITrasactions);

    const columns: ColumnsType<DataType> = useMemo(() => [
        {
            title: 'Action',
            dataIndex: 'side',
            key: 'side',
            width: 120,
            render: (text, { key }) => (
                <div className='action' key={key}>
                    <Button className='action-btn' onClick={() => onRemove(key)}>
                        <DeleteOutlined/>
                    </Button>
                    <div className='action-text'>{text}</div>
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
            title: 'Trade time',
            dataIndex: 'trade_time',
            key: 'trade_time',
            width: '25%',
            render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss', { timeZone: `GMT${user?.config.utc}` }),
        },
        {
            title: 'Order type',
            dataIndex: 'order_type',
            key: 'order_type',
            width: 110,
            render: text => text,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 110,
            render: text => text,
        },
        {
            title: 'Exec price',
            dataIndex: 'exec_price',
            key: 'exec_price',
            width: 110,
            render: text => text,
        },
        {
            title: 'Order quantity',
            dataIndex: 'order_qty',
            key: 'order_qty',
            width: 110,
            render: text => text,
        },
        {
            title: 'Exec quantity',
            dataIndex: 'exec_qty',
            key: 'exec_qty',
            width: 110,
            render: text => text,
        },
        {
            title: 'Exec value',
            dataIndex: 'exec_value',
            key: 'exec_price',
            width: 110,
            render: text => text,
        },
        {
            title: 'Closed size',
            dataIndex: 'closed_size',
            key: 'closed_size',
            width: 110,
            render: text => text,
        },
        {
            title: 'Leaves quantity',
            dataIndex: 'leaves_qty',
            key: 'leaves_qty',
            width: 110,
            render: text => text,
        },
    ], [user, pairs, onRemove]);

    const data: DataType[] = transactions.map(t => ({ key: t.id, ...t }));

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

export default Transactions;