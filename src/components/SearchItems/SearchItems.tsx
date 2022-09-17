import { ReactElement, useEffect, useRef, useState } from 'react';
import { Select, Tag } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import styled from 'styled-components';
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

const SearchItems = ({ predefinedValue = [], getItems, onValues }: {predefinedValue?: string[], getItems(args: {text?: string}): Promise<Item[]>, onValues(values: string[]): void }): ReactElement => {
    const [value, setValue] = useState<string[]>(predefinedValue);
    const ref = useRef({value: ''})

    const [options, setOptions] = useState<CustomTagProps[]>([]);

    const onSearch = (value: string) => {
        ref.current.value = value;
        setTimeout(async () => {
            if(value === ref.current.value){
                getItems({text: value}).then(items => setOptions(items.map(item => ({ label: item.title, value: item.id }) as CustomTagProps)))
            }
        }, 1000)
    };

    const onSelect = (v: string) => {
        setValue(value.concat([v]))
    };

    const onDeselect = (v: string) => {
        const index = value.indexOf(v);
        const buff = value.slice();
        buff.splice(index, 1);
        setValue(buff);
    }

    const filterOption = (inputValue: string, option: CustomTagProps | undefined) => {
        return option ? inputValue.indexOf(option.label as string) !== -1 : false
    }

    useEffect(() => {
        onValues(value);
    }, [value]);

    return <Container>
        <Select
                allowClear
                    mode="multiple"
                    className='add'
                    key={"label"}
                    filterOption={filterOption}
                    defaultValue={value}
                    onSearch={onSearch}
                    tagRender={tagRender}
                    onSelect={onSelect}
                    onDeselect={onDeselect}
                    style={{ width: '100%' }}
                    options={options}
                />
    </Container>
};

export default SearchItems;