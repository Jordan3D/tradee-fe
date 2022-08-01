import { memo, ReactElement, useContext } from 'react';
import { INote } from '../../../../interface/Note';
import { NotesContext } from '../../../../state/notePageContext';
import './styles.scss';

type ItemProps = {
    id: string,
    onSelectItem:(id: string) => void;
}

const Item = memo(({id, onSelectItem}:ItemProps): ReactElement => {
    const { noteMap } = useContext(NotesContext);
    const item = noteMap[id] as INote;

    const onClickHandler = () => {
        onSelectItem(id);
    };

    return <div className='note-item__root' onClick={onClickHandler}>
        {item.title}
    </div>
})

type ListProps = {
    selectedItem: string;
    onSelectItem:(id: string) => void;
}

const List = ({selectedItem, onSelectItem}: ListProps): ReactElement => {
    const { noteIds } = useContext(NotesContext);

    return <div className='notes-list__root'>
        <div className='list'>
            {noteIds.map(id => <Item id={id} onSelectItem={onSelectItem}/>)}
        </div>
    </div>
};

export default List;