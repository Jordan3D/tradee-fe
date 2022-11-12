import { Space, Table, Button, Modal, Form as AntdForm, Input, Popover } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DeleteOutlined, MoreOutlined, SyncOutlined } from '@ant-design/icons';
import { selectBrokerList } from '../../../../store/common/brokers';
import { IBroker, ICreateBroker } from '../../../../interface/Broker';
import { brokerSyncApi, brokerSyncClearApi } from '../../../../api/broker';
import { GlobalContext } from '../../../../state/context';
import { format } from 'date-fns-tz';
import { selectUser } from '../../../../store/common/meta';
import { invokeFeedback } from '../../../../utils/feedbacks/feedbacks';
import { Container, Title, Sync, Header, Delete, WarningText, FormFooter } from './style';

const useForm = AntdForm.useForm;
const FormItem = AntdForm.Item;

interface DataType extends IBroker {
    key: string;
}

type TableComponentProps = {
    className?: string;
}

const Brokers = ({ className = '' }: TableComponentProps): ReactElement => {
    const brokers = useSelector(selectBrokerList);
    const { getBrokers, createBroker, removeBroker } = useContext(GlobalContext);
    const user = useSelector(selectUser);
    const [form] = useForm();
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [onDeleteBroker, setOnDeleteBroker] = useState<IBroker | undefined>(undefined);

    const onAddClick = () => {
        setIsAddModalVisible(true);
    };

    const onCloseAddModal = () => {
        setIsAddModalVisible(false);
    };

    const onDelete = useCallback((broker: IBroker) => () => {
        setIsDeleteModalVisible(true);
        setOnDeleteBroker(broker);
    }, [])

    const onClickSync = useCallback((id: string) => () => {
        brokerSyncApi(id).then(() => {
            setTimeout(() => window.location.reload(), 500);
        });
    }, []);

    const onClickSyncClear = useCallback((id: string) => () => {
        brokerSyncClearApi(id).then((res) => {
            if (res) {
                invokeFeedback({ msg: 'Data cleared', type: 'success' });
                getBrokers();
            }
        }).catch((e) => {
            invokeFeedback({ msg: e.statusText, type: 'error' });
        });
    }, [getBrokers]);

    const columns: ColumnsType<DataType> = useMemo(() => [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: 250,
            render: text => text,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            render: text => text,
        },
        {
            title: 'Syncing',
            dataIndex: 'isSyncing',
            key: 'isSyncing',
            width: 150,
            render: text => text !== undefined ? String(text) : '',
        },
        {
            title: 'Sync data',
            dataIndex: 'lastSync',
            key: 'lastSync',
            width: 300,
            render: value => {
                if (!value) {
                    return '';
                }
                const { pnl, tradeTransactions } = JSON.parse(value);

                return `Pnl: ${pnl && Object.keys(pnl).length ? 'synced' : 'none'}, Transactions: ${tradeTransactions && Object.keys(tradeTransactions).length ? 'synced' : 'none'}`
            }
        },
        {
            title: 'Last updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 200,
            render: (value: string) => value ? format(new Date(value), 'dd/MM/yyyy HH:mm:ss', { timeZone: `GMT${user?.config.utc}` }) : '',
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 250,
            render: (_, record) => (
                <Popover content={() => <Space size="middle">
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
                    <Delete onClick={onDelete(record)}>
                        <DeleteOutlined />
                    </Delete>
                </Space>} trigger="click">
                    <Button type="primary"><MoreOutlined /></Button>
                </Popover>
            ),
        },
    ], [onClickSync, onClickSyncClear, user?.config.utc, onDelete]);

    const data: DataType[] = brokers.map(broker => ({ key: broker.id, ...broker }));

    const rowClassName = (record: DataType) => record.isRemoved ? 'disabled-row' : '';

    const onModalOk = async () => {
        if (onDeleteBroker) {
            await removeBroker(onDeleteBroker.id);
            setOnDeleteBroker(undefined);
            setIsDeleteModalVisible(false);
            await getBrokers();
        }
    }

    const handleCancel = () => {
        setIsDeleteModalVisible(false);
        setOnDeleteBroker(undefined);
    }

    const onFinish = (values: ICreateBroker) => {
        createBroker(values);
        setIsAddModalVisible(false);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (isAddModalVisible) {
            form.setFieldsValue({
                title: '',
                broker_type: 'ByBitFutures',
                api_key: '',
                secret_key: ''
            })
        }
    }, [form, isAddModalVisible]);

    return <Container className={`${className + ' '}`}>
        <Header>
            <Title>Brokers</Title>
            <Button className='add-btn' onClick={onAddClick}>Add</Button>
        </Header>
        <div className='table_content'>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowClassName={rowClassName}
                sticky
            />
            <Modal destroyOnClose width={600} visible={isDeleteModalVisible} onOk={onModalOk} onCancel={handleCancel}>
                <WarningText>
                    <div>Are you sure?</div>
                </WarningText>
            </Modal>
            <Modal destroyOnClose footer={null} width={1000} onCancel={onCloseAddModal} visible={isAddModalVisible}>
                <AntdForm
                    form={form}
                    name="addBrokerForm"
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <WarningText>Remember: you should set &quot;Read only&quot; flag for API key before adding</WarningText>
                    <FormItem name="title" label="Title">
                        <Input />
                    </FormItem>
                    <FormItem name="broker_type" label="Type">
                        <Input disabled />
                    </FormItem>
                    <FormItem name="api_key" label="Api key">
                        <Input />
                    </FormItem>
                    <FormItem name="secret_key" label="Secret key">
                        <Input />
                    </FormItem>
                    <FormFooter>
                        <Button type="primary" size='large' htmlType="submit">
                            Create
                        </Button>
                    </FormFooter>
                </AntdForm>
            </Modal>
        </div>
    </Container>
};

export default Brokers;