import { Button, Input, Form as AntdForm, Select, Tag } from 'antd';
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
import { AppDispatch } from '../../store';
import { GlobalContext } from '../../state/context';
import { fetchPairsData } from '../../store/common/pairs';
import ItemTitle from '../../components/Form/ItemTitle';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { selectJIDate, setJIDate } from '../../store/journalItem';
import { useSelector } from 'react-redux';
import { ICreateDI, IDiaryItem, IUpdateDI } from '../../interface/Diary';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { selectTagList } from '../../store/common/tags';
import { Container, Buttons } from './style';
import { DiaryContext } from '../../state/diaryContext';
import TagRender from '../../components/Tags/TagRender';

const useForm = AntdForm.useForm;
const FormItem = AntdForm.Item;


type TJouranlParams = {
    date?: string
}

export type TForm = Omit<IDiaryItem, 'createdAt' | 'updatedAt' | 'id'>;

const DiaryItem = (): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { tagsListHandler, getTrades, clearTrades, getTransactions, clearTransactions } = useContext(GlobalContext);
    const { dICreateHandler, dIUpdateHandler, diaryItemGet, dIDeleteHandler } = useContext(DiaryContext);
    const { id } = useParams();
    const { search } = useLocation();
    const tagList = useSelector(selectTagList);
    const [eState, setEState] = useState<EditorState>();
    const params: TJouranlParams = useMemo(() => qs.parse(search.substring(1)), [search]);

    const [form] = useForm();

    const itemDate = useSelector(selectJIDate);

    const [item, setItem] = useState<Partial<IDiaryItem> | undefined>({
        tags: [],
    });

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);

    const onFilter = (inputValue: string, option?: CustomTagProps) => {
        return option?.label?.toString().indexOf(inputValue) !== -1;
    };

    const onClose = () => {
        navigate(-1);
    };

    const onDelete = () => {
        if (id) {
            dIDeleteHandler(id);
            navigate(-1);
        }
    }

    const onFinish = async (values: ICreateDI & IUpdateDI) => {
        let result;
        const content = draftToHtmlPuri(
            convertToRaw((eState as EditorState)?.getCurrentContent())
        );
        if (id) {
            const additional = {
                tagsAdded: values?.tags.filter(id => item?.tags?.indexOf(id) === - 1) || [],
                tagsDeleted: item?.tags?.filter(id => values?.tags?.indexOf(id) === - 1) || [],
            }
            result = await dIUpdateHandler(id, { ...values, ...additional, content });
        } else {
            result = await dICreateHandler({ ...values, content } as ICreateDI);
        }
        if (result?.id)
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
        if (id) {
            (async () => {
                const data = await diaryItemGet(id);
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
                        tags: data.tags,
                    })
            })()
        }
    }, [diaryItemGet, form, id, setItem])

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
                    wrapperClassName="contentWrapper"
                    onEditorStateChange={onEditorStateChange}
                />
            </FormItem>
            <FormItem
                label="Tags"
                name="tags"
                className='note_form__item'
            >
                <Select
                    mode="multiple"
                    tagRender={TagRender({})}
                    filterOption={onFilter}
                    style={{ width: '100%' }}
                    options={tagOptions}
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

const DiaryItemPage = (): ReactElement => <Page isSecure><DiaryItem /></Page>

export default DiaryItemPage;