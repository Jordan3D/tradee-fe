import { Button, Form as AntdForm, Input, Popconfirm, Select, Tag } from 'antd';
import { useContext, useEffect, useMemo, useState } from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Editor } from "react-draft-wysiwyg";
import draftToHtmlPuri from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { NotesContext } from '../../../../state/notePageContext';
import { INote, INoteCreate, INoteUpdate } from '../../../../interface/Note';
import { useSelector } from 'react-redux';
import { selectTagList } from '../../../../store/common/tags';
import { selectNoteMap } from '../../../../store/common/notes';
import styled from 'styled-components';
import TagRender from '../../../../components/Tags/TagRender';

const Item = AntdForm.Item;
const useForm = AntdForm.useForm;

export type TNoteForm = Readonly<{ id?: string }>;

type Props = Readonly<{
    values: TNoteForm
    onClose: () => void
    onSelectNote: (id: string) => void
}>

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


const Container = styled.div`
padding: 1.2em;

.note_form {
    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 2rem;
    }
    &__item {
        padding: 0.6rem;
        /* background: #f6f6f6c9; */
        border: 1px dashed #dfdcdc
    }
}
`;

const Form = ({ values, onClose, onSelectNote }: Props) => {
    const { id } = values;
    const [form] = useForm();
    const tagList = useSelector(selectTagList); 
    const noteMap = useSelector(selectNoteMap);
    const { noteCreateHandler, noteUpdateHandler, noteDeleteHandler } = useContext(NotesContext);
    const [eState, setEState] = useState<EditorState>();

    const editNote = id ? noteMap[id] : undefined;

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);

    const onFinish = async (value: INoteCreate | INoteUpdate & Readonly<{tags: string[]}>) => {
        if (id) {
            let tagsAdded = [];
            let tagsDeleted = [];
            if(value.tags){
                tagsAdded = value.tags.filter(tagId => editNote?.tags?.indexOf(tagId) === - 1) || [];
                tagsDeleted = editNote?.tags?.filter(tagId => value.tags?.indexOf(tagId) === - 1) || [];

                (value as INoteUpdate).tagsAdded = tagsAdded;
                (value as INoteUpdate).tagsDeleted = tagsDeleted;
            }
            noteUpdateHandler(id, value as INoteUpdate);
            return;
        }
        const newNote = (await noteCreateHandler(value as INoteCreate)) as INote;

        if(newNote && newNote.id){
            onSelectNote(newNote.id);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onEditorStateChange = (editorState: EditorState) => {
        setEState(editorState);
        form.setFieldsValue({
            content: draftToHtmlPuri(
                convertToRaw(editorState.getCurrentContent())
            )
        })
    };

    const onDelete = async() => {
        if (id) {
            const res = await noteDeleteHandler(id);
            if(res){
                onClose();
            }
        }
    }

    const onDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }

    const onSearch = (v: string) => {
        console.log(v);
    }

    useEffect(() => {
        const state = (() => {
            const blocks = convertFromHTML(editNote?.content || '');
            return EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap));
        })();

        setEState(state);

        form.setFieldsValue({
            title: editNote?.title,
            content: editNote?.content,
            tags: editNote?.tags
        });
    }, [form, editNote])

    return <Container>
        <AntdForm
            form={form}
            name="loginForm"
            layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Item
                label="ID"
                className='note_form__item'
            >
                <Input value={id} disabled />
            </Item>

            <Item
                label="Title"
                name="title"
                className='note_form__item'
                rules={[
                    {
                        required: true,
                        message: '',
                    },
                ]}
            >
                <Input />
            </Item>

            <Item
                label="Content"
                name="content"
                className='note_form__item'
            >
                <Editor
                    editorState={eState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorStateChange}
                />
            </Item>

            <Item
                label="Tags"
                name="tags"
                className='note_form__item'
            >
                <Select
                allowClear
                    mode="multiple"
                    tagRender={TagRender({})}
                    onSearch={onSearch}
                    style={{ width: '100%' }}
                    options={tagOptions}
                />
            </Item>

            <Item>
                <div className="form__buttons">
                    <Button type="default" size='large' htmlType="button" onClick={onClose}>
                        Close
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={onDelete}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="button" onClick={onDeleteClick}>Delete</Button>
                    </Popconfirm>
                    <Button type="primary" size='large' htmlType="submit">
                        Submit
                    </Button>
                </div>
            </Item>
        </AntdForm>
    </Container>
};

export default Form;