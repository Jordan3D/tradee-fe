import { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useSelector } from 'react-redux';
import { selectTagMap } from '../../../../store/common/tags';
import { ITag } from '../../../../interface/Tag';
import { GlobalContext } from '../../../../state/context';
import { selectTagList } from '../../../../store/common/tags';
import { tradeUpdateApi } from '../../../../api/trade';
import { CloseOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
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

const Container = styled.div`
   border: 0.3rem solid wheat;
    min-height: 10rem;
    margin-top: 0.5rem;

    .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
    }

    .values {
        display: flex;
    }

    .tag-item {
        margin: 0.3rem;
        display: flex;
        padding: 0.3rem 3.3rem 0.3rem 0.3rem;
        border: 0.2rem solid rgb(233, 222, 14);
        background: rgb(253, 255, 216);
        position: relative;

        &__delete {
            position: absolute;
            top: 0.15rem;
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
        color: black !important;
    }

    .title {
        font-weight: 500;
        padding: 0;
        color: white;
    }
`;

const Tags = ({ tradeId, tags, updateTrade }: { tradeId: string, tags: string[], updateTrade: () => Promise<void> }): ReactElement => {
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

    return <Container>
        <div className='top'>
            <h3 className='title'>Tags</h3>
            <div>
                {!!value.length && <Button onClick={onAdd}>Add</Button>}
                <Select
                allowClear
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
            {tags.map(tId => <TagItem key={tId} item={tagMap[tId]} onDelete={onDelete} />)}
        </div>
    </Container>
};

export default Tags;