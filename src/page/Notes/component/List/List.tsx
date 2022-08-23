import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { INote } from '../../../../interface/Note';
import { selectNoteIds, selectNoteMap } from '../../../../store/common/notes';

const {Search} = Input;

type ItemProps = {
    id: string;
    isSelected: boolean;
    onSelectItem:(id: string) => void;
}

const ItemContainer = styled.div`

    display: flex;
        height: 6.5rem;
        border: 1px solid #d3d031;
        background-color: #ffffd0;
        margin-bottom: 1rem;
        box-shadow: 0.4rem 0.4rem 5px 0px rgba(0, 0, 0, 0.332); 
        transition: 0.35s ease all;
        cursor: pointer;

        &:hover {
            border-color: #e7e421;
            background-color: #e5e5ab;
            box-shadow: 0.1rem 0.1rem 5px 0px rgba(0, 0, 0, 0.151); 
        }
        
        &:last-child {
            margin-bottom: 0;
        }
`;

const Item = memo(({id, isSelected, onSelectItem}:ItemProps): ReactElement => {
    const noteMap = useSelector(selectNoteMap);
    const item = noteMap[id] as INote;
    const className = `${isSelected ? ' --selected' : ''}`;

    const onClickHandler = () => {
        onSelectItem(id);
    };

    return <ItemContainer className={className} onClick={onClickHandler}>
        {item.title}
    </ItemContainer>
})

type ListProps = {
    className?: string;
    selectedItem?: string;
    onSelectItem:(id: string) => void;
}

const Container = styled.div`

display: flex;
        padding: 1rem;
        flex-direction: column;
        width: 100%;

        .add_button {
            margin: 2rem;
        }

        .list {
                height: 50vw;
                overflow-y: scroll;
                padding: 1rem;
        }
`;

const List = ({className = '', selectedItem, onSelectItem}: ListProps): ReactElement => {
    const noteIds = useSelector(selectNoteIds);
    const [searchValue, setSearchValue] = useState('');

    const onAddNoteHandler = () => {
        onSelectItem('');
    };

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value?.toLowerCase();
        setSearchValue(value);
    }, []);

    return <Container className={`${className + ' '}`}>
        <Search value={searchValue} placeholder="Search note" onChange={onChange} />
        <Button className='add_button' onClick={onAddNoteHandler}>Add note</Button>
        <div className='list'>
            {noteIds.map(id => <Item key={id} id={id} isSelected={id === selectedItem} onSelectItem={onSelectItem}/>)}
        </div>
    </Container>
};

export default List;