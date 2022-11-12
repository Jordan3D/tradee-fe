import { Button, Input, Modal } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { INote } from '../../../../interface/Note';
import { NotesContext } from '../../../../state/notePageContext';
import { selectNoteStatus } from '../../../../store/common/notes';
import { GlobalContext } from '../../../../state/context';
import { SearchItems } from '../../../../components/SearchItems';
import { tagListGetApi } from '../../../../api/tag';
import { Container, ItemContainer, ItemTitle, ItemHover, ItemOpen, ItemEdit, ItemFilterTitle } from './style';
import ItemDemo from '../ItemDemo/ItemDemo';
import { PlusOutlined } from '@ant-design/icons';

const { Search } = Input;

type ItemProps = {
    item: GridItem;
    onEditItem: (id: string) => void;
    onWatchItem: (id: string) => void;
}

const Item = memo(({ item, onEditItem, onWatchItem }: ItemProps): ReactElement => {
    const { map } = useContext(NotesContext);
    const itemData = map[item.id] as INote;
    // const className = `${isSelected ? ' --selected' : ''}`;

    const onEditHandler = () => {
        onEditItem(item.id);
    };

    const onWatchHandler = () => {
        onWatchItem(item.id);
    }


    return itemData && <ItemContainer className="item">
        <ItemTitle>
            {itemData.title}
        </ItemTitle>
        <ItemHover className='on-hover'>
            <ItemOpen className='icon' onClick={onWatchHandler} />
            <ItemEdit className='icon' onClick={onEditHandler} />
        </ItemHover>
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
    const [watchItem, setWatchItem] = useState<string | undefined>(undefined);
    const status = useSelector(selectNoteStatus);

    const onAddNoteHandler = () => {
        onSelectItem('new');
    };

    const onTagValues = useCallback((values: string[]) => {
        console.log(values);
        setTagValues(values);
    }, [setTagValues]);

    const getData = useCallback((isCleared: boolean = false) => 
    listHandler({ text: searchText, limit: 25, tags: tagValues }, isCleared), [listHandler, searchText, tagValues]);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value?.toLowerCase();
        savedValue.current.value = text;
        setTimeout(async () => {
            if (text === savedValue.current.value) {
                setSearchText(text);
            }
        }, 1000)
    }, [setSearchText]);

    const onWatchItem = useCallback((id: string) => {
        setWatchItem(id)
    }, [setWatchItem]);

    const handleModalCancel = useCallback(() => {
        setWatchItem(undefined)
    }, [setWatchItem]);

    useEffect(() => {
        tagsListHandler();
    }, [tagsListHandler])

    useEffect(() => {
        return clearData
    }, [clearData])

    useEffect(() => {
        setIsSearching(true);
        getData(true);
    }, [tagValues, getData]);

    useEffect(() => {
        setItems(ids.map((id, count) => ({ groupKey: count, id })));
        setTimeout(() => {
            if (isSearching)
                setIsSearching(false)
        }, 1000);
    }, [ids, isSearching])

    return <Container className={`${className + ' '}`}>
        <div className='top'>
            <div>
                <Button className='add_button' onClick={onAddNoteHandler}>
                    <PlusOutlined />
                </Button>
            </div>
            <div className='filters'>
                <div className='search-item'>
                    <Search allowClear placeholder="Search idea" onChange={onChange} loading={status === 'pending'} />
                </div>
                <div className='other-items'>
                    <div className='filter-item'>
                        <ItemFilterTitle>
                            Tags
                        </ItemFilterTitle>
                        <SearchItems key={'tags'} getItems={tagListGetApi} onValues={onTagValues} />
                    </div>
                </div>
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
                {items.map((item: GridItem) => <Item item={item} data-grid-groupkey={item.groupKey} onWatchItem={onWatchItem} onEditItem={onSelectItem} />)}
            </MasonryInfiniteGrid>}
        </div>
        <Modal width={1300} destroyOnClose visible={!!watchItem} footer={false} onCancel={handleModalCancel}>
            <ItemDemo id={watchItem as string} />
        </Modal>
    </Container>
});

export default List;