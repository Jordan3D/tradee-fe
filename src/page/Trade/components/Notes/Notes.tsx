import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Select, Tag, Tooltip } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useSelector } from 'react-redux';
import { NotesContext } from '../../../../state/notePageContext';
import { selectNoteIds, selectNoteMap } from '../../../../store/common/notes';
import { tradeUpdateApi } from '../../../../api/trade';
import { INote } from '../../../../interface/Note';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';
;

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

const NoteItem = ({ item, onDelete }: { item: INote, onDelete: (id: string) => Promise<void> }) => {
    const onDeleteItem = async () => {
        onDelete(item.id);
    }

    return <div className='note-item'>
        <Tooltip title={<div dangerouslySetInnerHTML={{__html: item.content}}/>}>
            <div className='note-item__title'>
                {item?.title}
            </div>
        </Tooltip>
        <Button className='note-item__delete' onClick={onDeleteItem}>
            <CloseOutlined />
        </Button>
    </div>
}

const Container = styled.div`
  border: 0.3rem solid  pink;
    min-height: 20rem;  
    
    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .values {
        display: flex;
    }

    .note-item {
        margin: 0.3rem;
        display: flex;
        padding: 0.8rem 4rem 0.8rem 0.8rem;
        border: 0.2rem solid rgb(245, 51, 183);
        background: rgb(246, 218, 242);
        position: relative;

        &__delete {
            position: absolute;
            top: 0.4rem;
            right: 0;
            width: 2rem;
            padding: 0;
            background: transparent;
            border-color: transparent;
            font-size: 1rem;
        }
    }

    .add {
        width: 20rem !important;
        color: black;
    }

    .title {
        font-weight: 500;
        color: white;
        padding: 0;
    }
`;

const Notes = ({ tradeId, notes, updateTrade }: { tradeId: string, notes: string[], updateTrade: () => Promise<void> }): ReactElement => {
    const { noteListHandler } = useContext(NotesContext);
    const noteMap = useSelector(selectNoteMap);
    const noteList = useSelector(selectNoteIds);
    const [value, setValue] = useState<ReadonlyArray<string>>([]);

    const noteOptions = useMemo(() => noteList.filter(note => !notes.find(nId => note === nId)).map(id => ({ label: noteMap[id].title, value: id }) as CustomTagProps), [noteMap, noteList, notes]);

    const onSelect = (v: ReadonlyArray<string>) => {
        setValue(value.concat(v))
    };

    const onAdd = async () => {
        await tradeUpdateApi(tradeId, { notesAdded: value });
        setValue([]);
        await updateTrade();
    }

    const onDelete = async (id: string) => {
        await tradeUpdateApi(tradeId, { notesDeleted: [id] });
        await updateTrade();
    }

    useEffect(() => {
        noteListHandler({});
    }, [noteListHandler]);

    return <Container>
        <div className='top'>
            <h3 className='title'>Notes</h3>
            <div>
                {!!value.length && <Button onClick={onAdd}>Add</Button>}
                <Select
                    mode="multiple"
                    className='add'
                    value={value}
                    tagRender={tagRender}
                    onSelect={onSelect}
                    style={{ width: '100%' }}
                    options={noteOptions}
                />
            </div>
        </div>
        <div className='values'>
            {notes.map(tId => <NoteItem item={noteMap[tId]} onDelete={onDelete} />)}
        </div>
    </Container>
};

export default Notes;