import { Space, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { SyncOutlined } from '@ant-design/icons';
import { selectBrokerList } from '../../../../store/common/brokers';
import { IBroker } from '../../../../interface/Broker';
import { brokerSyncApi, brokerSyncClearApi } from '../../../../api/broker';
import { GlobalContext } from '../../../../state/context';
import { format } from 'date-fns-tz';
import { selectUser } from '../../../../store/common/meta';
import { invokeFeedback } from '../../../../utils/feedbacks/feedbacks';

interface DataType extends IBroker {
    key: string;
}

type TableComponentProps = {
    className?: string;
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

const Title = styled.h3`
    
`;

const Sync = styled(Button)`
  padding: 0.8rem 1.6rem;
    width: auto;
    height: auto;
    display: flex;
    align-items: center;

    .button-text {
      font-size: 1rem;
      margin-right: 2rem;
    }

    .button-icon {
      font-size: 1.2rem;
      position: relative;
      top: 0.2rem;
    }
`

const Brokers = ({ className = '' }: TableComponentProps): ReactElement => {
    const brokers = useSelector(selectBrokerList);
    const {getBrokers} = useContext(GlobalContext);
    const user = useSelector(selectUser);

    const onClickSync = useCallback((id: string) => () => {
        brokerSyncApi(id).then(() => {
            setTimeout(() => window.location.reload(), 500);
        });
    }, []);

    const onClickSyncClear = useCallback((id: string) => () => {
        brokerSyncClearApi(id).then((res) => {
            if(res){
                invokeFeedback({ msg: 'Data cleared', type: 'success' });
                getBrokers();
            }
        }).catch((e) => {
            invokeFeedback({ msg: e.statusText, type: 'error' });
        });
    }, [getBrokers]);

    const columns: ColumnsType<DataType> = useMemo(() => [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: '20%',
            render: text => text,
        },
        {
            title: 'Syncing',
            dataIndex: 'isSyncing',
            key: 'isSyncing',
            width: 200,
            render: text => text !== undefined ? String(text) : '',
        },
        {
            title: 'Sync data',
            dataIndex: 'lastSync',
            key: 'lastSync',
            width: 300,
            render: value => {
                if(!value){
                    return '';
                }
                const {pnl, tradeTransactions} = JSON.parse(value);

                return `Pnl: ${pnl && Object.keys(pnl).length ? 'synced': 'none'}, Transactions: ${tradeTransactions && Object.keys(tradeTransactions).length ? 'synced': 'none'}`
            }
        },
        {
            title: 'Last updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 200,
            render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm:ss', {timeZone: `GMT${user?.config.utc}`}) : '',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Sync onClick={onClickSync(record.id)}>
                        <div className='button-text'>
                            Sync data
                        </div>
                        <SyncOutlined className='button-icon' />
                    </Sync>
                    <Sync onClick={onClickSyncClear(record.id)}>
                        <div className='button-text'>
                            Clear sync dates
                        </div>
                        <SyncOutlined className='button-icon' />
                    </Sync>
                </Space>
            ),
        },
    ], [onClickSync, onClickSyncClear]);

    const data: DataType[] = brokers.map(broker => ({ key: broker.id, ...broker }));

    return <Container className={`${className + ' '}`}>
        <Title>Brokers</Title>
        <div className='table_content'>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                sticky
            />
        </div>
    </Container>
};

export default Brokers;