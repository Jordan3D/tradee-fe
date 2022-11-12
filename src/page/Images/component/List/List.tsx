import { Button, Input } from 'antd';
import { ChangeEvent, memo, ReactElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { selectNoteStatus } from '../../../../store/common/notes';
import { Container, ItemContainer, ItemTitle, Image, ItemButtons } from './style';
import { IFile } from '../../../../interface/Idea';
import { ImagesContext } from '../../../../state/imagesContext';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

const { Search } = Input;

type ItemProps = {
    item: GridItem;
}

const Item = memo(function Item({ item }: ItemProps): ReactElement {
    const { map, imageDeleteHandler } = useContext(ImagesContext);
    const itemData = map[item.id] as IFile;

    const onDelete = () => {
        imageDeleteHandler(item.id);
    }

    const onCopy = () => {
        navigator.clipboard.writeText(itemData.url)
    }

    return itemData && <ItemContainer className="item">
        <ItemTitle>
            {itemData.key}
        </ItemTitle>
        <Image src={itemData.url} alt={itemData.url}/>
        <ItemButtons className='buttons'>
            <CopyOutlined className='button' onClick={onCopy}/>
            <DeleteOutlined className='button' onClick={onDelete}/>
        </ItemButtons>
    </ItemContainer>
})

type GridItem = { id: string, groupKey: number };

type ListProps = {
    className?: string;
    onSelectItem: (id: string) => void;
}

const List = memo(function List({ className = '', onSelectItem }: ListProps): ReactElement{
    const { imageListHandler, ids, clearData } = useContext(ImagesContext);
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
                imageListHandler({ text, limit: 25 }, true);
            }
        }, 500)
    }, []);

    useEffect(() => {
        imageListHandler({ limit: 25 });
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
            <Search className='seatch' allowClear placeholder="Search by name" onChange={onChange} loading={status === 'pending'} />
            <Button className='add_button' onClick={onAddNoteHandler}>Add</Button>
        </div>
        <div className='list'>
            {(!!ids.length && !isSearching) && <MasonryInfiniteGrid
                className="container"
                gap={34}
                container
                onRequestAppend={() => {
                    if(Date.now() - timeout.current.value <1000){
                        timeout.current.value = Date.now();
                        return;
                    }

                    if (!isSearching && !loadMore) {
                        setLoadMore(true);
                        imageListHandler({ limit: 25, lastId: ids.length ? ids[ids.length - 1] : '' });
                        timeout.current.value = Date.now();
                    }
                }}
            >
                {items.map((item: GridItem) => <Item key={item.id} item={item} data-grid-groupkey={item.groupKey}/>)}
            </MasonryInfiniteGrid>}
        </div>
    </Container>
});

export default List;