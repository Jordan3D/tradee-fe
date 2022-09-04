import { Pagination, Table, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import qs from 'qs';
import { format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';
import { ITransaction } from '../../../../interface/Transaction';
import { selectTransactionsStore } from '../../../../store/transactions';

interface DataType extends ITransaction {
    key: string;
}

type TableComponentProps = {
    className?: string;
    selected?: string[];
    onSelected?(rows: TableComponentProps['selected']): void;
    onGetData?(params: any): void;
}

type PaginationProps = {
    total: number,
    pageSize: number,
    current: number
    onChange: (page: number, pageSize: number) => void
};

const PaginationComponent = ({ total, pageSize, current, onChange }: PaginationProps): ReactElement => {
    return (
        <Pagination
            total={total}
            showTotal={(t, r) => `${t} items`}
            pageSize={pageSize}
            defaultCurrent={current}
            onChange={onChange}
        />
    )
}

const Container = styled.div`
       display: flex;
        padding: 1rem;
        flex-direction: column;
        width: 100%;

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
    height: 80vh;
    width: 100%;
    overflow-y: scroll;
    margin-bottom: 1rem;

    &.tiny {
        height: auto;
    }
    .disabled-row {
        background-color: #dcdcdc;
  pointer-events: none;
    }
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

const TableComponent = ({ className = '', selected = [], onSelected, onGetData }: TableComponentProps): ReactElement => {
    const { data: transactions, page, total, pageSize } = useSelector(selectTransactionsStore);
    const user = useSelector(selectUser);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);

    const [selectedRowKeys, setSelectedRowKeys] = useState<Record<string, string[]>>({});

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
            width: 180,
            render: text => pairs[text]?.title || 'unknown',
        },
        {
            title: 'Trade time',
            dataIndex: 'trade_time',
            key: 'trade_time',
            width: 160,
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

    const onChangeHandler = (pagination: TablePaginationConfig) => {
        console.log(pagination)
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        const params = { limit: pageSize, offset: pageSize * (page - 1) };
        if(onGetData){
            onGetData(params);
        } else {
            navigate(`${pathname}?${qs.stringify(params)}`)
        }
    }

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys({...selectedRowKeys, [page]: newSelectedRowKeys});
      };

    const rowSelection = onSelected ? {
        selectedRowKeys: selectedRowKeys[page],
        onChange: onSelectChange
    } : undefined;

    const rowClassName = (record: DataType) => {
        return selected.includes(record.id) ? `disabled-row` : ''
    }

    useEffect(() => {
        return () => {
            if (onSelected) {
                onSelected(Object.entries(selectedRowKeys).map(([page, arr]) => arr).flat());
            }
        }
    }, [selectedRowKeys, onSelected])

    return <Container className={`${className + ' '}`}>
        <div className={`table_content${onSelected ? ' tiny' : ' '}`}>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                onChange={onChangeHandler}
                rowSelection={rowSelection}
                rowClassName={rowClassName}
                sticky
            />
        </div>
        {total ?  <PaginationComponent total={total} current={page} pageSize={pageSize} onChange={onPaginationChange} /> : <></>}
    </Container>
};

export default TableComponent;