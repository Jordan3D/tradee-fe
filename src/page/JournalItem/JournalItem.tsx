import { Button, Input, Modal, Form as AntdForm, Select, Tag } from 'antd';
import qs from 'qs';
import { format } from 'date-fns';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Pnl } from '../Journal/components/Pnl';
import { Table as TablePnl } from '../Trades/component/Table';
import { Table as TableTransactions } from '../Transactions/component/Table';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { GlobalContext } from '../../state/context';
import { NotesContext } from '../../state/notePageContext';
import { fetchPairsData } from '../../store/common/pairs';
import { selectJIDate, setJIDate, setJIPnls, setJIsetTransactions } from '../../store/journalItem';
import { useSelector } from 'react-redux';
import { tradesIdsPostApi } from '../../api/trade';
import { transactionsIdsPostApi } from '../../api/transaction';
import { Transactions } from '../Journal/components/Transactions';
import { ICreateJI, IJournalItem, IUpdateJI } from '../../interface/Journal';
import { JournalContext } from '../../state/journalContext';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { selectTagList } from '../../store/common/tags';
import { selectNoteIds, selectNoteMap } from '../../store/common/notes';
import { Container, Title, Header, Buttons } from './style';

const useForm = AntdForm.useForm;
const FormItem = AntdForm.Item;


type TJouranlParams = {
    date?: string
}

export type TForm = Omit<IJournalItem, 'tags' | 'notes' | 'createdAt' | 'updatedAt' | 'id'>;

const tagRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={'orange'}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
};

const JournalItem = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { tagsListHandler, getTrades, clearTrades, getTransactions, clearTransactions } = useContext(GlobalContext);
    const { jICreateHandler, jIUpdateHandler, journalItemGet } = useContext(JournalContext);
    const { noteListHandler } = useContext(NotesContext);
    const { id } = useParams();
    const { search } = useLocation();
    const tagList = useSelector(selectTagList);
    const noteList = useSelector(selectNoteIds);
    const noteMap = useSelector(selectNoteMap);
    const [isPnlModalVisible, setIsPnlModalVisible] = useState(false);
    const [isTransactionsModalVisible, setIsTransactionsModalVisible] = useState(false);
    const params: TJouranlParams = useMemo(() => qs.parse(search.substring(1)), [search]);

    const [form] = useForm();

    const itemDate = useSelector(selectJIDate);

    const [item, setItem] = useState<Partial<IJournalItem> | undefined>({
        pnls: [],
        transactions: [],
        tags: [],
        notes: []
    });

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);
    const noteOptions = useMemo(() => noteList.map(note => ({ label: noteMap[note].title, value: noteMap[note].id }) as CustomTagProps), [noteList, noteMap]);

    const onFilter = (inputValue: string, option?: CustomTagProps) => {
        return option?.label?.toString().indexOf(inputValue) !== -1;
    };

    const showModal = (name: 'transactions' | 'pnl') => () => {
        if (name === 'pnl')
            setIsPnlModalVisible(true);
        if (name === 'transactions')
            setIsTransactionsModalVisible(true)
    };

    const handleOk = () => {
        setIsPnlModalVisible(false);
        setIsTransactionsModalVisible(false)
    };

    const handleCancel = () => {
        setIsPnlModalVisible(false);
        setIsTransactionsModalVisible(false)
    };

    const onPnlSelected = (selected: string[]) => {
        setItem({...item, pnls: item?.pnls?.concat(selected)});
    }

    const onTransactionSelected = (selected: string[]) => {
        setItem({...item, transactions: item?.transactions?.concat(selected)});
    }

    const onClose = () => {
        navigate(-1);
    };

    const onFinish = (values: ICreateJI & IUpdateJI) => {
        const flatData = {
            pnls: item?.pnls as string[],
            transactions: item?.transactions as string[],
        };
        if (id) {
            const additional = {
                tagsAdded: values?.tags.filter(id => item?.tags?.indexOf(id) === - 1) || [],
                tagsDeleted: item?.tags?.filter(id => values?.tags?.indexOf(id) === - 1) || [],
                notesAdded: values?.notes.filter(id => item?.notes?.indexOf(id) === - 1) || [],
                notesDeleted: item?.notes?.filter(id => values?.notes?.indexOf(id) === - 1) || []
            };

            jIUpdateHandler(id, { ...values, ...additional, ...flatData });
        } else {
            jICreateHandler({ ...values, ...flatData } as ICreateJI);
        }
        navigate(-1);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getTrades({ limit: 10 });
        getTransactions({ limit: 10 });
        dispatch(fetchPairsData());
        tagsListHandler();
        noteListHandler({});
        return () => {
            clearTrades();
            clearTransactions();
        };
    }, [dispatch, noteListHandler, tagsListHandler, getTrades, clearTrades, getTransactions, clearTransactions])

    useEffect(() => {
        if (params.date) {
            dispatch(setJIDate(new Date(params.date).toISOString()));
        }
    }, [dispatch, params.date]);

    useEffect(() => {
        if (!isPnlModalVisible) {
            tradesIdsPostApi(item?.pnls as string[]).then(result => dispatch(setJIPnls(result)))
        }
    }, [isPnlModalVisible, item?.pnls, dispatch]);

    useEffect(() => {
        if (!isTransactionsModalVisible) {
            transactionsIdsPostApi(item?.transactions as string[]).then(result => dispatch(setJIsetTransactions(result)))
        }
    }, [isTransactionsModalVisible, item?.transactions, dispatch]);

    useEffect(() => {
        if (id) {
            (async () => {
                const data = await journalItemGet(id);
                setItem(data);
                if (data)
                    form.setFieldsValue({
                        title: data.title,
                        content: data.content,
                        pnls: data.pnls,
                        transactions: data.transactions,
                        tags: data.tags,
                        notes: data.notes
                    })
            })()
        }
    }, [journalItemGet, form, id])

    return <Container>
        <Title>New Item ({format(new Date(itemDate), 'MMMM dd yyyy')})</Title>
        <AntdForm
            form={form}
            name="journalItemForm"
            layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <FormItem name="title" label="Title" rules={[{ required: true, message: 'Title is required!' }]}>
                <Input />
            </FormItem>
            <FormItem name="content" label="Content">
                <Input />
            </FormItem>
            <FormItem>
                <Header>
                    <Title>Pnl</Title>
                    <Button className='add-btn' onClick={showModal('pnl')}>Add</Button>
                </Header>
                <Pnl />
                <Modal width={1500} destroyOnClose visible={isPnlModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <TablePnl onSelected={onPnlSelected} selected={item?.pnls} onGetData={getTrades} />
                </Modal>
            </FormItem>
            <FormItem>
                <Header>
                    <Title>Transactions</Title>
                    <Button className='add-btn' onClick={showModal('transactions')}>Add</Button>
                </Header>
                <Transactions />
                <Modal width={1500} destroyOnClose visible={isTransactionsModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <TableTransactions onSelected={onTransactionSelected} selected={item?.transactions} onGetData={getTransactions} />
                </Modal>
            </FormItem>
            <FormItem
                label="Tags"
                name="tags"
                className='note_form__item'
            >
                <Select
                    mode="multiple"
                    tagRender={tagRender}
                    filterOption={onFilter}
                    style={{ width: '100%' }}
                    options={tagOptions}
                />
            </FormItem>
            <FormItem
                label="Notes"
                name="notes"
                className='note_form__item'
            >
                <Select
                allowClear
                    mode="multiple"
                    tagRender={tagRender}
                    filterOption={onFilter}
                    style={{ width: '100%' }}
                    options={noteOptions}
                />
            </FormItem>
            <Buttons>
                <Button type="default" size='large' htmlType="button" onClick={onClose}>
                    Back
                </Button>
                <Button type="primary" size='large' htmlType="submit">
                    Submit
                </Button>
            </Buttons>
        </AntdForm>
    </Container>
}

const JournalItemPage = (): ReactElement => <Page isSecure><JournalItem /></Page>

export default JournalItemPage;