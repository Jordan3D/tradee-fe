import { Button, Form as AntdForm, Input, Popconfirm, Select, Tag, UploadFile } from 'antd';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { Editor } from "react-draft-wysiwyg";
import draftToHtmlPuri from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js';
import { useSelector } from 'react-redux';
import { selectTagList } from '../../../../store/common/tags';
import styled from 'styled-components';
import { IdeasContext } from '../../../../state/ideaPageContext';
import { ICreateIdea, IFile, IIdea, IUpdateIdea } from '../../../../interface/Idea';
import { selectIdeaMap } from '../../../../store/common/ideas';
import { selectNoteIds, selectNoteMap } from '../../../../store/common/notes';
import {ImageUploader} from '../../../../components/ImageUploader';

const Item = AntdForm.Item;
const useForm = AntdForm.useForm;

export type TIdeaForm = Readonly<{ id?: string }>;

type Props = Readonly<{
    values: TIdeaForm
    onClose: () => void
    onSelectItem: (id: string) => void
}>

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

const Container = styled.div`
  padding: 1.2em;
  height: 100%;
  .note_form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    .form-div {

    }

    &__buttons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1em;
    }
    &__item {
        padding: 0.6rem;
        /* background: #f6f6f6c9; */
        border: 1px dashed #dfdcdc
    }
   }
`;

const Form = ({ values, onClose, onSelectItem }: Props) => {
    const { id } = values;
    const [form] = useForm();
    const tagList = useSelector(selectTagList);
    const noteList = useSelector(selectNoteIds);
    const noteMap = useSelector(selectNoteMap);
    const map = useSelector(selectIdeaMap);
    const { createHandler, updateHandler, deleteHandler } = useContext(IdeasContext);
    const [eState, setEState] = useState<EditorState>();
    const [photos, setPhotos] = useState<UploadFile[]>([]);

    const editItem = id ? map[id] : undefined;

    const photosAsUploadFile = useMemo(() =>
     editItem?.photos ? editItem?.photos.map(photo => ({uid: photo.id, thumbUrl: photo.url, name: photo.key})) as UploadFile[] : []
     , [editItem?.photos]);

    const tagOptions = useMemo(() => tagList.map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList]);
    const noteOptions = useMemo(() => noteList.map(note => ({ label: noteMap[note]?.title, value: noteMap[note]?.id }) as CustomTagProps), [noteList, noteMap]);

    const onFinish = async (value: ICreateIdea | IUpdateIdea & Readonly<{ tags: string[], notes: string[], content: EditorState }>) => {
        const content = draftToHtmlPuri(
            convertToRaw((eState as EditorState)?.getCurrentContent())
        );

        if (id && id !== 'new') {
            let added = [];
            let deleted = [];
            if (value.tags) {
                added = value.tags.filter(id => editItem?.tags?.indexOf(id) === - 1) || [];
                deleted = editItem?.tags?.filter(id => value.tags?.indexOf(id) === - 1) || [];

                (value as IUpdateIdea).addedTags = added;
                (value as IUpdateIdea).deletedTags = deleted;
            }
            added = [];
            deleted = [];

            if (value.notes) {
                added = value.notes.filter(id => editItem?.notes?.indexOf(id) === - 1) || [];
                deleted = editItem?.notes?.filter(id => value.notes?.indexOf(id) === - 1) || [];

                (value as IUpdateIdea).addedNotes = added;
                (value as IUpdateIdea).deletedNotes = deleted;
            }

            added = [];
            deleted = [];

            if (value.notes) {
                added = photos.filter(fp => editItem?.photos?.find(p => p.id !== fp.uid)) || [];
                deleted = editItem?.photos?.filter(fp => photos?.find(p => p.uid !== fp.id)) || [];

                (value as IUpdateIdea).addedPhotos = added.map(p => p.uid);
                (value as IUpdateIdea).deletedPhotos = deleted.map(p => p.id);
            }


            updateHandler(id, { ...value, content } as IUpdateIdea);
            return;
        } else {
            const newItem = (await createHandler({ ...value, content, photos: photos.map(p => p.uid) } as ICreateIdea)) as IIdea;
            onSelectItem(newItem.id);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const onEditorStateChange = (editorState: EditorState) => {
        setEState(editorState);
    };

    const onDelete = async () => {
        if (id) {
            const res = await deleteHandler(id);
            if (res) {
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

    const onFileListChange = useCallback((list: UploadFile[]) => {
        setPhotos(list);
    }, [])

    useEffect(() => {
        const state = (() => {
            const blocks = convertFromHTML(editItem?.content || '');
            return EditorState.createWithContent(ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap));
        })();

        setEState(state);

        form.setFieldsValue({
            title: editItem?.title,
            content: editItem?.content,
            tags: editItem?.tags,
            notes: editItem?.notes,
            photos: editItem?.photos
        });
    }, [form, editItem])

    return <Container>
        <AntdForm
            form={form}
            name="editIdea"
            layout='vertical'
            onFinish={onFinish}
            className="idea_form"
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <div className='form-div'>
                <Item
                    label="ID"
                    className='idea_form__item'
                >
                    <Input value={id} disabled />
                </Item>

                <Item
                    label="Title"
                    name="title"
                    className='idea_form__item'
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
                    className='idea_form__item'
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
                    className='idea_form__item'
                >
                    <Select
                        allowClear
                        mode="multiple"
                        tagRender={tagRender}
                        onSearch={onSearch}
                        style={{ width: '100%' }}
                        options={tagOptions}
                    />
                </Item>
                <Item
                    label="Notes"
                    name="notes"
                    className='idea_form__item'
                >
                    <Select
                        allowClear
                        mode="multiple"
                        tagRender={tagRender}
                        onSearch={onSearch}
                        style={{ width: '100%' }}
                        options={noteOptions}
                    />
                </Item>
               <ImageUploader data={photosAsUploadFile} onFileListChange={onFileListChange}/>
            </div>
            <div className='form-div'>
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
                            <Button className="button" size='large' onClick={onDeleteClick}>Delete</Button>
                        </Popconfirm>
                        <Button type="primary" size='large' htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Item>
            </div>
        </AntdForm>
    </Container>
};

export default Form;