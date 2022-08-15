import { Pagination, Table, TablePaginationConfig, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement } from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { selectTradesStore } from '../../../../store/trades';
import './style.scss';

interface DataType {
    key: string;
    action: string;
    pairId: string;
    leverage: number;
    pnl: number;
    tags: string[];
}

type TableComponentProps = {
    className?: string;
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
            showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} items`}
            pageSize={pageSize}
            defaultCurrent={current}
            onChange={onChange}
        />
    )
}

const TableComponent = ({ className = '' }: TableComponentProps): ReactElement => {
    const { data: trades, page, total, pageSize } = useSelector(selectTradesStore);
    const {pathname, search} = useLocation();
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);

    const columns: ColumnsType<DataType> = [
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: text => text,
        },
        {
            title: 'Pair',
            dataIndex: 'pairId',
            key: 'pairId',
            render: text => pairs[text]?.title || 'unknown',
        },
        {
            title: 'Leverage',
            dataIndex: 'leverage',
            key: 'leverage',
            render: text => text,
        },
        {
            title: 'Date Open',
            dataIndex: 'dateOpen',
            key: 'dateOpen',
            render: text => text,
        },
        {
            title: 'Date Close',
            dataIndex: 'dateClose',
            key: 'dateClose',
            render: text => text,
        },
        {
            title: 'Pnl',
            dataIndex: 'pnl',
            key: 'pnl',
            render: text => text,
        },
        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        }
    ];

    const data: DataType[] = trades.map(trade => ({ key: trade.id, ...trade }));

    const onChangeHandler = (pagination: TablePaginationConfig) => {
        console.log(pagination)
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        navigate(`${pathname}?${qs.stringify({limit: pageSize, offset: pageSize*(page-1)})}`)
    }

    return <div className={`${className + ' '}trades-table__root`}>
        <div className='table_content'>
            <Table columns={columns} dataSource={data} pagination={false} onChange={onChangeHandler} sticky/>
        </div>
        <PaginationComponent total={total} current={page} pageSize={pageSize} onChange={onPaginationChange}/>
    </div>
};

export default TableComponent;