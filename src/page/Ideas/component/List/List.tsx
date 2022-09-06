import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { fetchNotesData, selectNoteStatus } from '../../../../store/common/notes';
import { Container, ItemContainer, ItemTitle, ItemContent } from './style';
import { GlobalContext } from '../../../../state/context';
import { IdeasContext } from '../../../../state/ideaPageContext';
import { IIdea } from '../../../../interface/Idea';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';

const { Search } = Input;

type ItemProps = {
    item: GridItem;
    onSelectItem: (id: string) => void;
}

const Item = memo(({ item, onSelectItem }: ItemProps): ReactElement => {
    const { map } = useContext(IdeasContext);
    const itemData = map[item.id] as IIdea;
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
    const dispatch = useDispatch<AppDispatch>();
    const { tagsListHandler } = useContext(GlobalContext);
    const { listHandler, ids, clearData } = useContext(IdeasContext);
    const savedValue = useRef<{ value: string }>({ value: '' });
    const timeout = useRef<{ value: number }>({ value: 0 });
    const [items, setItems] = useState<GridItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [loadMore, setLoadMore] = useState(true);
    const status = useSelector(selectNoteStatus);

    const onAddNoteHandler = () => {
        onSelectItem('new');
    };

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value?.toLowerCase();
        savedValue.current.value = text;
        setTimeout(async () => {
            if (text === savedValue.current.value) {
                setIsSearching(true);
                listHandler({ text, limit: 25 });
            }
        }, 1000)
    }, []);

    useEffect(() => {
        tagsListHandler();
        dispatch(fetchNotesData({}));
    }, [])

    useEffect(() => {
        listHandler({ limit: 25 });

        return clearData
    }, [])

    useEffect(() => {
        setItems(ids.map((id, count) => ({ groupKey: count, id })));
        setTimeout(() => {
            if(loadMore)
            setLoadMore(false)

            if(isSearching)
            setIsSearching(false)
        }, 1000);
    }, [ids])

    return <Container className={`${className + ' '}`}>
        <div className='top'>
            <Search className='seatch' allowClear placeholder="Search idea" onChange={onChange} loading={status === 'pending'} />
            <Button className='add_button' onClick={onAddNoteHandler}>Add idea</Button>
        </div>
        <div className='list'>
            {(!!ids.length && !isSearching) && <MasonryInfiniteGrid
                className="container"
                gap={34}
                container
                onRequestAppend={() => {
                    console.log(Date.now() - timeout.current.value);
                    if(Date.now() - timeout.current.value < 1000){
                        timeout.current.value = Date.now();
                        return;
                    }
                    if (!isSearching && !loadMore) {
                        setLoadMore(true);
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