import './style.scss';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const TreeNodeTitle = ({ onAdd, onDelete, onEdit, title }: Readonly<{ onAdd?: any, onDelete?: any, onEdit?: any, title?: string }>) => {
    return <div className="tree-node-title__root">
        {onAdd && <Button className="button"><PlusOutlined /></Button>}
        <div className="tree-node-title__text">{title}</div>
        <div className="tree-node-title__buttons">
            {onEdit && <Button className="button"><EditOutlined /></Button>}
            {onDelete && <Button className="button"><DeleteOutlined /></Button>}
        </div>
    </div>;
};

export default TreeNodeTitle;