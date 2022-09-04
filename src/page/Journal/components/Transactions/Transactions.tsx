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

interface DataType extends ITransaction {
    key: string;
}

const Container = styled.div`
     display: flex;
     flex-direction: column;
     width: 100%;
     margin-top: 1rem;

    .add_button {
        margin: 2rem;
    }

    table {
         font-size: 1.2rem;
    }

    .list {
            height: 50vw;
            overflow-y: scroll;
            padding: 1rem;
    }

.table_content {
    width: 100%;
    overflow-y: scroll;
}

.trades-item {
    &__root {
        display: flex;
        height: 6.5rem;
        border: 1px solid #d3d031;
        background-color: #ffffd0;
        margin-bottom: 1rem;
        box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 
        transition: 0.35s ease all;
        cursor: pointer;

        &:hover {
            border-color: #e7e421;
            background-color: #e5e5ab;
            box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
        }
        
        &:last-child {
            margin-bottom: 0;
        }
    }
}
`;

const Transactions = memo((): ReactElement => {
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
    ], [user, pairs]);

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