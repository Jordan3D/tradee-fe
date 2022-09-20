import { Pagination, Table as AntTable, TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import { format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';
import { ITransaction } from '../../../../interface/Transaction';
import { selectTransactionsStore } from '../../../../store/transactions';
import {Table} from '../../../../components/Table';
import { SorterResult } from 'antd/es/table/interface';
import { sortMap, sortMapKeys } from '../../../../utils/common';

interface DataType extends ITransaction {
    key: string;
}

type TableComponentProps = {
    className?: string;
    selected?: string[];
    onSelected?(rows: TableComponentProps['selected']): void;
    onGetData?(params: any): void;
    onSetParams?(params: any): void;
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

const Container = styled(Table)`

`;

const TableComponent = ({ className = '', selected = [], onSelected, onGetData, onSetParams }: TableComponentProps): ReactElement => {
    const { data: transactions, page, total, pageSize, orderBy } = useSelector(selectTransactionsStore);
    const user = useSelector(selectUser);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const buff = useRef<any>(null);
    const [orederKey, orderDirection = 'ASC'] = orderBy; 

    const [selectedRowKeys, setSelectedRowKeys] = useState<Record<string, string[]>>({});

    console.log(orederKey === 'trade_time' ?  sortMapKeys[orderDirection] : undefined);

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
            sortOrder: orederKey === 'trade_time' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true
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
            sortOrder: orederKey === 'order_qty' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true
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
    ], [user, pairs, orederKey, orderDirection]);

    const data: DataType[] = transactions.map(t => ({ key: t.id, ...t }));

    const onChangeHandler = (_0: TablePaginationConfig, _1: any, sorter: SorterResult<DataType> | SorterResult<DataType>[]) => {
        if(Array.isArray(sorter)){
            return;
        }
        const sortDirection = sorter.order ? sortMap[sorter.order] : '';
        const params = { orderBy: [sorter.field, sortDirection] };

        if(!sortDirection) {
            return;
        }
        if (onGetData) {
            onGetData(params);
        } else if(onSetParams){
            onSetParams(params);
        }
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        const params = { limit: pageSize, offset: pageSize * (page - 1) };
        if(onGetData){
            onGetData(params);
        } else if(onSetParams){
            onSetParams(params);
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
                onSelected(Object.entries(buff.current as Record<string, string[]>).map(([page, arr]) => arr).flat());
            }
        }
    }, [onSelected])

    buff.current = selectedRowKeys;

    return <Container className={`${className + ' '}`}>
        <div className={`table_content${onSelected ? ' tiny' : ' '}`}>
            <AntTable
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