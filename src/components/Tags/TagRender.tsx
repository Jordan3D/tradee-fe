import { Tag, Tooltip } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import styled from 'styled-components';

const CustomTag = styled(Tag)`

  &.ant-tag {
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 1rem;
    width: 100%;
  }
  & .anticon-close {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
  }
`;

interface MapItem {
    content: string
}

const TagRender = ({color = 'orange', map}: {color?: string, map?: Record<string, MapItem | undefined>}) => (props: CustomTagProps) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const item = map ? map[value] : undefined;
    
    return (
        <CustomTag
            color={color}
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
           {item && item.content ? <Tooltip title={<div dangerouslySetInnerHTML={{__html: item.content || ''}}/>}>
            <div className='note-item__title'>
                {label}
            </div>
        </Tooltip> : label}
        </CustomTag>
    );
};

export default TagRender;