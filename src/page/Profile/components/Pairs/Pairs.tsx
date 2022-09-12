import { Table, Button, Modal, Form as AntdForm, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Title, Header, FormFooter } from './style';
import { IPair, ICreatePair } from '../../../../interface/Pair';
import { fetchPairsData, selectPairsIds, selectPairsMap } from '../../../../store/common/pairs';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { addPairApi } from '../../../../api/pair';
import useError from '../../../../utils/useError';
import { processFetch } from '../../../../api/_main';

const useForm = AntdForm.useForm;
const FormItem = AntdForm.Item;

interface DataType extends IPair {
    key: string;
}

type TableComponentProps = {
    className?: string;
}

const Pairs = ({ className = '' }: TableComponentProps): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const ids = useSelector(selectPairsIds);
    const map = useSelector(selectPairsMap);
    const processError = useError();
    const [form] = useForm();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    const onAddClick = () => {
        setIsAddModalVisible(true);
    };

    const onCloseAddModal = () => {
        setIsAddModalVisible(false);
    };

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
        }
    ], []);

    const data: DataType[] = ids.map(pairId => ({ key: pairId, ...map[pairId] }));

    const onFinish = async (values: ICreatePair) => {
        await processFetch({
            onRequest: () => addPairApi(values),
            onData: () => {
                dispatch(fetchPairsData());
                setIsAddModalVisible(false);
            },
            ...processError
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        if (isAddModalVisible) {
            form.setFieldsValue({
                title: '',
            })
        }
    }, [form, isAddModalVisible]);

    useEffect(() => {
        dispatch(fetchPairsData());
    }, [])

    return <Container className={`${className + ' '}`}>
        <Header>
            <Title>Pairs</Title>
            <Button className='add-btn' onClick={onAddClick}>Add</Button>
        </Header>
        <div className='table_content'>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                sticky
            />
            <Modal destroyOnClose footer={null} width={1000} onCancel={onCloseAddModal} visible={isAddModalVisible}>
                <AntdForm
                    form={form}
                    name="addPair"
                    layout='vertical'
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <FormItem name="title" label="Title">
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

export default Pairs;