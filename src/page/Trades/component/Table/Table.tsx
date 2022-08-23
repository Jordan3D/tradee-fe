import { Pagination, Table, TablePaginationConfig, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useMemo } from 'react';
import qs from 'qs';
import {format} from 'date-fns-tz';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectPairsMap } from '../../../../store/common/pairs';
import { selectTradesStore } from '../../../../store/trades';
import { selectTagMap } from '../../../../store/common/tags';
import { ITrade } from '../../../../interface/Trade';
import routes from '../../../../router';
import styled from 'styled-components';
import { selectUser } from '../../../../store/common/meta';

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

const Container = styled.div`
       display: flex;
        padding: 1rem;
        flex-direction: column;
        width: 100%;

    .add_button {
        margin: 2rem;
    }

    table {
         font-size: 0.8rem;
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

const TableComponent = ({ className = '' }: TableComponentProps): ReactElement => {
    const { data: trades, page, total, pageSize } = useSelector(selectTradesStore);
    const user = useSelector(selectUser);
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const pairs = useSelector(selectPairsMap);
    const tagMap = useSelector(selectTagMap);

    const columns: ColumnsType<DataType> = useMemo(() => [
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
            render: (value: string) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss', {timeZone: `GMT${user?.config.utc}`}),
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
    ], [user, pairs, tagMap]);

    const data: DataType[] = trades.map(trade => ({ key: trade.id, ...trade }));

    const onChangeHandler = (pagination: TablePaginationConfig) => {
        console.log(pagination)
    }

    const onPaginationChange = (page: number, pageSize: number) => {
        navigate(`${pathname}?${qs.stringify({limit: pageSize, offset: pageSize*(page-1)})}`)
    }

    const onRowChose = (trade: DataType) => () => {
        navigate(routes.trade(trade.id));
    }

    const onTableRow = (record: DataType, rowIndex: number | undefined) => {
        return {
          onDoubleClick: onRowChose(record)
        };
      }

    return <Container className={`${className + ' '}`}>
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
    </Container>
};

export default TableComponent;