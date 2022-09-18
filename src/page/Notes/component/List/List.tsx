import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { INote } from '../../../../interface/Note';
import { NotesContext } from '../../../../state/notePageContext';
import { selectNoteStatus } from '../../../../store/common/notes';
import { Container, ItemContainer, ItemTitle, ItemContent } from './style';
import { GlobalContext } from '../../../../state/context';
import { SearchItems } from '../../../../components/SearchItems';
import { tagListGetApi } from '../../../../api/tag';
import { useUpdateEffect } from 'react-use';

const { Search } = Input;

type ItemProps = {
    item: GridItem;
    onSelectItem: (id: string) => void;
}

const Item = memo(({ item, onSelectItem }: ItemProps): ReactElement => {
    const { map } = useContext(NotesContext);
    const itemData = map[item.id] as INote;
    // const className = `${isSelected ? ' --selected' : ''}`;

    const onClickHandler = () => {
        onSelectItem(item.id);
    };

    return itemData && <ItemContainer className="item" onClick={onClickHandler}>
        <ItemTitle>
            {itemData.title}
        </ItemTitle>
        <ItemContent dangerouslySetInnerHTML={{ __html: itemData.content }} />
    </ItemContainer>
})

type GridItem = { id: string, groupKey: number };

type ListProps = {
    className?: string;
    selectedItem?: string;
    onSelectItem: (id: string) => void;
}

const List = memo(({ className = '', onSelectItem }: ListProps): ReactElement => {
    const { tagsListHandler } = useContext(GlobalContext);
    const { isLastItem, ids, listHandler, clearData } = useContext(NotesContext);
    const savedValue = useRef<{ value: string }>({ value: '' });
    const timeout = useRef<{ value: number }>({ value: 0 });
    const [searchText, setSearchText] = useState('');
    const [items, setItems] = useState<GridItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [tagValues, setTagValues] = useState<string[]>([]);
    const status = useSelector(selectNoteStatus);

    const onAddNoteHandler = () => {
        onSelectItem('new');
    };

    const onTagValues = useCallback((values: string[]) => {
        setTagValues(values);
    }, []);

    const getData = (isCleared: boolean = false) => listHandler({ text: searchText, limit: 25, tags: tagValues }, isCleared);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value?.toLowerCase();
        savedValue.current.value = text;
        setTimeout(async () => {
            if (text === savedValue.current.value) {
                setSearchText(text);
            }
        }, 1000)
    }, [listHandler]);

    useEffect(() => {
        tagsListHandler();
    }, [])

    useEffect(() => {
        return clearData
    }, [])

    useEffect(() => {
        setIsSearching(true);
        getData(true);
    }, [tagValues, searchText]);

    useEffect(() => {
        setItems(ids.map((id, count) => ({ groupKey: count, id })));
        setTimeout(() => {
            if (isSearching)
                setIsSearching(false)
        }, 1000);
    }, [ids])

    return <Container className={`${className + ' '}`}>
        <div className='top'>
            <div>
                <Search className='seatch' allowClear placeholder="Search note" onChange={onChange} loading={status === 'pending'} />
                <Button className='add_button' onClick={onAddNoteHandler}>Add note</Button>
            </div>
            <div>
                <SearchItems getItems={tagListGetApi} onValues={onTagValues} />
            </div>
        </div>
        <div className='list'>
            {(!!ids.length && !isSearching) && <MasonryInfiniteGrid
                className="container"
                gap={34}
                container
                onRequestAppend={() => {
                    if (Date.now() - timeout.current.value < 1000) {
                        timeout.current.value = Date.now();
                        return;
                    }

                    if (!isSearching && !isLastItem) {
                        listHandler({ limit: 25, lastId: ids.length ? ids[ids.length - 1] : '' });
                        timeout.current.value = Date.now();
                    }
                }}
            >
                {items.map((item: GridItem) => <Item item={item} data-grid-groupkey={item.groupKey} onSelectItem={onSelectItem} />)}
            </MasonryInfiniteGrid>}
        </div>
    </Container>
});

export default List;