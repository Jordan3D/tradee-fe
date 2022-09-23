import { Button, Input, Modal, Form as AntdForm, Select, Tag } from 'antd';
import { format } from 'date-fns';
import draftToHtmlPuri from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs';
import qs from 'qs';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { useDispatch } from 'react-redux';
import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Page } from '../../components/Page';
import { Pnl } from '../Journal/components/Pnl';
import { Table as TablePnl } from '../Trades/component/Table';
import { Table as TableTransactions } from '../Transactions/component/Table';
import { AppDispatch } from '../../store';
import { GlobalContext } from '../../state/context';
import { fetchPairsData } from '../../store/common/pairs';
import ItemTitle from '../../components/Form/ItemTitle';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { removePnlById, removeTransactionById, selectJIDate, setJIDate, setJIPnls, setJIsetTransactions } from '../../store/journalItem';
import { useSelector } from 'react-redux';
import { tradesIdsPostApi } from '../../api/trade';
import { transactionsIdsPostApi } from '../../api/transaction';
import { Transactions } from '../Journal/components/Transactions';
import { ICreateJI, IJournalItem, IUpdateJI } from '../../interface/Journal';
import { JournalContext } from '../../state/journalContext';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { selectTagList } from '../../store/common/tags';
import { fetchNotesData, selectNoteIds, selectNoteMap } from '../../store/common/notes';
import { Container, Header, Buttons } from './style';
import { fetchIdeasData, selectIdeaIds, selectIdeaMap } from '../../store/common/ideas';
import { ideaListOffsetGetApi } from '../../api/idea';

const useForm = AntdForm.useForm;
const FormItem = AntdForm.Item;


type TJouranlParams = {
    date?: string
}

export type TForm = Omit<IJournalItem, 'tags' | 'notes' | 'createdAt' | 'updatedAt' | 'id'>;

const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
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

const ideaRender = (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color={'grey'}
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
    const { jICreateHandler, jIUpdateHandler, journalItemGet, jIDeleteHandler } = useContext(JournalContext);
    const { id } = useParams();
    const { search } = useLocation();
    const tagList = useSelector(selectTagList);
    const noteList = useSelector(selectNoteIds);
    const noteMap = useSelector(selectNoteMap);
    const ideaList = useSelector(selectIdeaIds);
    const ideaMap = useSelector(selectIdeaMap);
    const [isPnlModalVisible, setIsPnlModalVisible] = useState(false);
    const [isTransactionsModalVisible, setIsTransactionsModalVisible] = useState(false);
    const [eState, setEState] = useState<EditorState>();
    const params: TJouranlParams = useMemo(() => qs.parse(search.substring(1)), [search]);

    const [form] = useForm();

    const itemDate = useSelector(selectJIDate);

    const [item, setItem] = useState<Partial<IJournalItem> | undefined>({
        pnls: [],
        transactions: [],
        tags: [],
        notes: [],
        ideas: []
    });

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);
    const noteOptions = useMemo(() => noteList.map(note => ({ label: noteMap[note]?.title, value: noteMap[note]?.id }) as CustomTagProps), [noteList, noteMap]);
    const ideaOptions = useMemo(() => ideaList.map(idea => ({ label: ideaMap[idea]?.title, value: ideaMap[idea]?.id }) as CustomTagProps), [ideaList, ideaMap]);

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
        setItem({ ...item, pnls: item?.pnls?.concat(selected) });
    }

    const onRemovePnl = (id: string) => {
        setItem({ ...item, pnls: item?.pnls?.filter(pId => pId !== id) });
        dispatch(removePnlById(id));
    };

    const onTransactionSelected = (selected: string[]) => {
        setItem({ ...item, transactions: item?.transactions?.concat(selected) });
    }

    const onRemoveTransaction = (id: string) => {
        setItem({ ...item, transactions: item?.transactions?.filter(tId => tId !== id) });
        dispatch(removeTransactionById(id));
    };

    const onClose = () => {
        navigate(-1);
    };

    const onDelete = () => {
        if (id) {
            jIDeleteHandler(id);
            navigate(-1);
        }
    }

    const onFinish = (values: ICreateJI & IUpdateJI) => {
        console.log(values);
        const content = draftToHtmlPuri(
            convertToRaw((eState as EditorState)?.getCurrentContent())
        );
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

            jIUpdateHandler(id, { ...values, ...additional, ...flatData, content });
        } else {
            jICreateHandler({ ...values, ...flatData, content } as ICreateJI);
        }
        navigate(-1);
    };

    const onEditorStateChange = (editorState: EditorState) => {
        setEState(editorState);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        getTrades({ limit: 10 });
        getTransactions({ limit: 10 });
        dispatch(fetchPairsData());
        tagsListHandler();
        dispatch(fetchNotesData({}));
        dispatch(fetchIdeasData({}));
        return () => {
            clearTrades();
            clearTransactions();
        };
    }, [dispatch, tagsListHandler, getTrades, clearTrades, getTransactions, clearTransactions])

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
                const state = (() => {
                    const blocks = htmlToDraft(data?.content || '');
                    return EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap));
                })();

                setEState(state);
                setItem(data);
                if (data)
                    form.setFieldsValue({
                        title: data.title,
                        content: data.content,
                        pnls: data.pnls,
                        transactions: data.transactions,
                        tags: data.tags,
                        notes: data.notes,
                        ideas: data.ideas
                    })
            })()
        }
    }, [journalItemGet, form, id, setItem])

    return <Container>
        <ItemTitle>{`${id ? item?.title : 'New Item'} (${format(new Date(itemDate), 'MMMM dd yyyy')})`}</ItemTitle>
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
                <Editor
                    editorState={eState}
                    onEditorStateChange={onEditorStateChange}
                />
            </FormItem>
            <FormItem>
                <Header>
                    <div className='ant-form-item-label'>
                        <label>
                            Pnl
                        </label>
                    </div>
                    <Button className='add-btn' size='large' onClick={showModal('pnl')}>Add</Button>
                </Header>
                <Pnl onRemove={onRemovePnl} />
                <Modal width={1500} destroyOnClose visible={isPnlModalVisible} onOk={handleOk} onCancel={handleCancel}>
                    <TablePnl onSelected={onPnlSelected} selected={item?.pnls} onGetData={getTrades} />
                </Modal>
            </FormItem>
            <FormItem>
                <Header>
                    <div className='ant-form-item-label'>
                        <label>
                            Transactions
                        </label>
                    </div>
                    <Button className='add-btn' size='large' onClick={showModal('transactions')}>Add</Button>
                </Header>
                <Transactions onRemove={onRemoveTransaction} />
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
            <FormItem
                label="Ideas"
                name="ideas"
                className='note_form__item'
            >
                <Select
                    allowClear
                    mode="multiple"
                    tagRender={ideaRender}
                    filterOption={onFilter}
                    style={{ width: '100%' }}
                    options={ideaOptions}
                />
            </FormItem>
            <Buttons>
                <Button type="default" size='large' htmlType="button" onClick={onClose}>
                    Back
                </Button>
                {id && <Button type="default" size='large' htmlType="button" onClick={onDelete}>
                    Delete
                </Button>}
                <Button type="primary" size='large' htmlType="submit">
                    Submit
                </Button>
            </Buttons>
        </AntdForm>
    </Container>
}

const JournalItemPage = (): ReactElement => <Page isSecure><JournalItem /></Page>

export default JournalItemPage;