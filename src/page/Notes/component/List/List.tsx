import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useState } from 'react';
import { INote } from '../../../../interface/Note';
import { NotesContext } from '../../../../state/notePageContext';
import './style.scss';

const {Search} = Input;

type ItemProps = {
    id: string;
    isSelected: boolean;
    onSelectItem:(id: string) => void;
}

const Item = memo(({id, isSelected, onSelectItem}:ItemProps): ReactElement => {
    const { noteMap } = useContext(NotesContext);
    const item = noteMap[id] as INote;
    const className = `note-item__root${isSelected ? ' --selected' : ''}`;

    const onClickHandler = () => {
        onSelectItem(id);
    };

    return <div className={className} onClick={onClickHandler}>
        {item.title}
    </div>
})

type ListProps = {
    className?: string;
    selectedItem?: string;
    onSelectItem:(id: string) => void;
}

const List = ({className = '', selectedItem, onSelectItem}: ListProps): ReactElement => {
    const { noteIds} = useContext(NotesContext);
    const [searchValue, setSearchValue] = useState('');

    const onAddNoteHandler = () => {
        onSelectItem('');
    };

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value?.toLowerCase();
        setSearchValue(value);
    }, []);

    return <div className={`${className + ' '}notes-list__root`}>
        <Search value={searchValue} placeholder="Search note" onChange={onChange} />
        <Button className='add_button' onClick={onAddNoteHandler}>Add note</Button>
        <div className='list'>
            {noteIds.map(id => <Item key={id} id={id} isSelected={id === selectedItem} onSelectItem={onSelectItem}/>)}
        </div>
    </div>
};

export default List;