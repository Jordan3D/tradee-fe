import { Pagination, TablePaginationConfig, Tag, Table as AntTable } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import qs from 'qs';
import { format } from 'date-fns-tz';
import { useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { selectTradesStore } from '../../../../store/trades';
import { selectTagMap } from '../../../../store/common/tags';
import { ITrade } from '../../../../interface/Trade';
import routes from '../../../../router';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';
import {Table} from '../../../../components/Table';
import { SorterResult } from 'antd/es/table/interface';
import { sortMap, sortMapKeys } from '../../../../utils/common';

interface DataType extends ITrade {
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

const Container = styled(Table)``;

const TableComponent = ({ className = '', selected = [], onSelected, onGetData, onSetParams }: TableComponentProps): ReactElement => {
    const { data: trades, page, total, pageSize, orderBy } = useSelector(selectTradesStore);
    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const tagMap = useSelector(selectTagMap);
    const buff = useRef<any>(null);
    const [orederKey, orderDirection = 'ASC'] = orderBy; 

    const [selectedRowKeys, setSelectedRowKeys] = useState<Record<string, string[]>>({});

    const columns: ColumnsType<DataType> = useMemo(() => [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: text => text.toLowerCase() === 'buy' ? 'Closed short' : 'Closed long',
        },
        {
            title: 'Pair',
            dataIndex: 'pairId',
            key: 'pairId',
            width: '15%',
            render: text => pairs[text]?.title || 'unknown',
            sortOrder: orederKey === 'pairId' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true
        },
        {
            title: 'Leverage',
            dataIndex: 'leverage',
            key: 'leverage',
            width: 100,
            render: text => text,
            sortOrder: orederKey === 'leverage' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true
        },
        {
            title: 'Open trade time',
            dataIndex: 'openTradeTime',
            key: 'openTradeTime',
            width: '25%',
            render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss', { timeZone: `GMT${user?.config.utc}` }),
            sortOrder: orederKey === 'openTradeTime' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true,
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
            sortOrder: orederKey === 'pnl' ?  sortMapKeys[orderDirection] : undefined,
            sorter: true,
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
    ], [user, pairs, tagMap, orederKey, orderDirection]);

    const data: DataType[] = trades.map(trade => ({ key: trade.id, ...trade }));

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
        if (onGetData) {
            onGetData(params);
        } else if(onSetParams){
            onSetParams(params);
        }
    }

    const onRowChose = (trade: DataType) => () => {
        navigate(routes.trade(trade.id));
    }

    const onSelectChange = (newSelecedRows: React.Key[]) => {
        setSelectedRowKeys({ ...selectedRowKeys, [page]: newSelecedRows });
    };

    const onTableRow = (record: DataType, rowIndex: number | undefined) => {
        return {
            onDoubleClick: onSelected ? undefined : onRowChose(record)
        };
    }

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
                onRow={onTableRow}
                rowSelection={rowSelection}
                rowClassName={rowClassName}
                sticky
            />
        </div>
        {total ? <PaginationComponent total={total} current={page} pageSize={pageSize} onChange={onPaginationChange} /> : <></>}
    </Container>
};

export default TableComponent;