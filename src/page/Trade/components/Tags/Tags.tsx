import './style.scss';
import { ReactElement, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Table, Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useSelector } from 'react-redux';
import { selectTagMap } from '../../../../store/common/tags';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { ITag } from '../../../../interface/Tag';
import { GlobalContext } from '../../../../state/context';
import { selectTagList } from '../../../../store/common/tags';
import { tradeUpdateApi } from '../../../../api/trade';
import { CloseOutlined } from '@ant-design/icons';
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

const TagItem = ({ item, onDelete }: { item: ITag, onDelete: (id: string) => Promise<void> }) => {
    const onDeleteItem = async () => {
        onDelete(item.id);
    }

    return <div className='tag-item'>
        <div className='tag-item__title'>
            {item?.title}
        </div>
        <Button className='tag-item__delete' onClick={onDeleteItem}>
            <CloseOutlined />
        </Button>
    </div>
}


const Tags = ({ tradeId, tags, updateTrade }: { tradeId: string, tags: string[], updateTrade: () => Promise<void> }): ReactElement => {
    const dispatch = useDispatch<AppDispatch>();
    const { tagsListHandler } = useContext(GlobalContext);
    const tagMap = useSelector(selectTagMap);
    const tagList = useSelector(selectTagList);
    const [value, setValue] = useState<ReadonlyArray<string>>([]);

    const tagOptions = useMemo(() => tagList.filter(tag => !tags.find(tId => tag.id === tId)).map(tag => ({ label: tag.title, value: tag.id }) as CustomTagProps), [tagList, tags]);

    const onSelect = (v: ReadonlyArray<string>) => {
        setValue(value.concat(v))
    };

    const onAdd = async () => {
        await tradeUpdateApi(tradeId, { tagsAdded: value });
        setValue([]);
        await updateTrade();
    }

    const onDelete = async (id: string) => {
        await tradeUpdateApi(tradeId, { tagsDeleted: [id] });
        await updateTrade();
    }

    useEffect(() => {
        tagsListHandler();
    }, [tagsListHandler]);

    return <div className='trade-tags'>
        <div className='top'>
            <h3 className='title'>Tags</h3>
            <div>
                {!!value.length && <Button onClick={onAdd}>Add</Button>}
                <Select
                    mode="multiple"
                    className='add'
                    value={value}
                    tagRender={tagRender}
                    onSelect={onSelect}
                    style={{ width: '100%' }}
                    options={tagOptions}
                />
            </div>
        </div>
        <div className='values'>
            {tags.map(tId => <TagItem item={tagMap[tId]} onDelete={onDelete} />)}
        </div>
    </div>
};

export default Tags;