import { Pagination, Table, TablePaginationConfig, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement } from 'react';
import qs from 'qs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { selectTradesStore } from '../../../../store/trades';
import './style.scss';
import { selectTagMap } from '../../../../store/common/tags';
import { ITrade } from '../../../../interface/Trade';

interface DataType extends ITrade {
    key: string;
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
            showTotal={(t, r) => `${t} items`}
            pageSize={pageSize}
            defaultCurrent={current}
            onChange={onChange}
        />
    )
}

const TableComponent = ({ className = '' }: TableComponentProps): ReactElement => {
    const { data: trades, page, total, pageSize } = useSelector(selectTradesStore);
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const tagMap = useSelector(selectTagMap);

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
            width: 140,
            render: text => text,
        },
        {
            title: 'Position close',
            dataIndex: 'close',
            key: 'close',
            width: 140,
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
    ];

    const data: DataType[] = trades.map(trade => ({ key: trade.id, ...trade }));

    const onChangeHandler = (pagination: TablePaginationConfig) => {
        console.log(pagination)
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        navigate(`${pathname}?${qs.stringify({limit: pageSize, offset: pageSize*(page-1)})}`)
    }

    const onRowChose = (trade: DataType) => () => {
        // navigate();
    }

    const onTableRow = (record: DataType, rowIndex: number | undefined) => {
        return {
          onDoubleClick: onRowChose(record)
        };
      }

    return <div className={`${className + ' '}trades-table__root`}>
        <div className='table_content'>
            <Table 
            columns={columns} 
            dataSource={data} 
            pagination={false} 
            onChange={onChangeHandler} 
            onRow={onTableRow}
            sticky
            />
        </div>
        <PaginationComponent total={total} current={page} pageSize={pageSize} onChange={onPaginationChange}/>
    </div>
};

export default TableComponent;