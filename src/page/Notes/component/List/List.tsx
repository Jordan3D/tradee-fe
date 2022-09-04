import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { INote } from '../../../../interface/Note';
import { NotesContext } from '../../../../state/notePageContext';
import { selectNoteIds, selectNoteMap, selectNoteStatus } from '../../../../store/common/notes';
import { Container, ItemContainer, ItemTitle, ItemContent } from './style';
import { GlobalContext } from '../../../../state/context';

const { Search } = Input;

type ItemProps = {
    item: GridItem;
    onSelectItem: (id: string) => void;
}

const Item = memo(({ item, onSelectItem }: ItemProps): ReactElement => {
    const noteMap = useSelector(selectNoteMap);
    const itemData = noteMap[item.id] as INote;
    // const className = `${isSelected ? ' --selected' : ''}`;

    const onClickHandler = () => {
        onSelectItem(item.id);
    };

    return itemData && <ItemContainer className="item" onClick={onClickHandler}>
        <ItemTitle>
            {itemData.title}
        </ItemTitle>
        <ItemContent dangerouslySetInnerHTML={{__html: itemData.content}}/>
    </ItemContainer>
})

type GridItem = { id: string, groupKey: number };

type ListProps = {
    className?: string;
    selectedItem?: string;
    onSelectItem: (id: string) => void;
}

const List = memo(({ className = '', selectedItem, onSelectItem }: ListProps): ReactElement => {
    const noteIds = useSelector(selectNoteIds);
    const { tagsListHandler } = useContext(GlobalContext);
    const { noteListHandler } = useContext(NotesContext);
    const savedValue = useRef<{ value: string }>({ value: '' });
    const [items, setItems] = useState<GridItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [offset, setOffset] = useState(0);
    const status = useSelector(selectNoteStatus);

    const onAddNoteHandler = () => {
        onSelectItem('new');
    };

    const getItems = (nextGroupKey: number, count: number) => {
        const nextItems = [];

        for (let i = 0; i < count; ++i) {
            if (noteIds.length > nextGroupKey + i) {
                nextItems.push({ groupKey: nextGroupKey + count, id: noteIds[nextGroupKey + i] });
            } else {
                console.log('Load more')
                // show "Load more"
            }
        }

        return nextItems;
    }

    const onSearch = useCallback((text: string) => noteListHandler({ text }), [noteListHandler]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value?.toLowerCase();
        savedValue.current.value = value;
        setTimeout(async () => {
            if (value === savedValue.current.value) {
                setIsSearching(true);
                onSearch(value);
            }
        }, 1000)
    }, [onSearch]);

    useEffect(() => {
        tagsListHandler();
        noteListHandler({});
    }, [noteListHandler, tagsListHandler])

    useEffect(() => {
        if (status === 'pending') {
            setItems([]);
        }
        if (status === 'succeeded') {
            setIsSearching(false);
            console.log('go')
        }
    }, [isSearching, status]);

    return <Container className={`${className + ' '}`}>
        <Search className='seatch' allowClear placeholder="Search note" onChange={onChange} loading={status === 'pending'} />
        <Button className='add_button' onClick={onAddNoteHandler}>Add note</Button>
        <div className='list'>
            {(!!noteIds.length && !isSearching) && <MasonryInfiniteGrid
                className="container"
                gap={20}
                requestPrepend={(e: any) => {
                    console.log('requestPrepend');
                    // set page -1 and load
                }}
                onRequestAppend={(e) => {
                    const nextGroupKey = (+e.groupKey! || -1) + 1;
                    console.log(e);
                    e.wait();

                    if (!isSearching) {
                        setTimeout(() => {
                            e.ready();
                            setItems([
                                ...items,
                                ...getItems(nextGroupKey, 15),
                            ]);
                        }, 1000);
                    }
                }}
            >
                {items.map((item: GridItem) => <Item item={item} data-grid-groupkey={item.groupKey} onSelectItem={onSelectItem} />)}
            </MasonryInfiniteGrid>}
        </div>
    </Container>
});

export default List;