import { memo, ReactElement, useEffect, useRef, useState } from 'react';
import { Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import styled from 'styled-components';
import { useUpdateEffect } from 'react-use';
import TagRender from '../Tags/TagRender';
;

interface Item {
    id: string
    title: string
};

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

const Container = styled.div`   

`;

interface Props {
    className?: string,
    predefinedValue?: string[], getItems(args: {text?: string}): Promise<Item[]>, onValues(values: string[]): void
}

const SearchItems = memo(({ className = '', predefinedValue = [], getItems, onValues }: Props): ReactElement => {
    const [value, setValue] = useState<string[]>(predefinedValue);
    const ref = useRef({value: ''});
    const isClearingRef = useRef({value: false}); // is needed for correct clearing beacuse of multiple paralel deselecting 

    const [options, setOptions] = useState<CustomTagProps[]>([]);

    const onSearch = (value: string) => {
        ref.current.value = value;
        setTimeout(async () => {
            if(value === ref.current.value){
                getItems({text: value}).then(items => setOptions(items.map(item => ({ label: item.title, value: item.id }) as CustomTagProps)))
            }
        }, 500)
    };

    const onSelect = (v: string) => {
        setValue(value.concat([v]))
    };

    const onDeselect = (v: string) => {
        if(isClearingRef.current.value){
            return
        }
        const index = value.indexOf(v);
        const buff = value.slice();
        buff.splice(index, 1);
        setValue(buff);
    }

    const onClear = () => {
        isClearingRef.current.value = true;
        setValue([]);
    }

    const filterOption = (inputValue: string, option: CustomTagProps | undefined) => {
        return option ? (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) !== -1 : false
    }

    useUpdateEffect(() => {
        onValues(value);
    }, [value, onValues]);

    return <Container className={className}>
        <Select
                allowClear
                    mode="multiple"
                    className='add'
                    filterOption={filterOption}
                    defaultValue={value}
                    onSearch={onSearch}
                    tagRender={TagRender({})}
                    onSelect={onSelect}
                    onDeselect={onDeselect}
                    onClear={onClear}
                    style={{ width: '100%' }}
                    options={options}
                />
    </Container>
});

export default SearchItems;