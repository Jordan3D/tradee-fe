import './style.scss';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import React from 'react';

const TreeNodeTitle = ({ onAdd, onDelete, onEdit, title, }: Readonly<{ onAdd?: any, onDelete?: any, onEdit?: any, title?: string }>) => {
    const onRootClick = () => {
        if(onEdit){
            onEdit();
            return;
        }
        if(onAdd){
            onAdd();
        }
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    }
    
    return <div className="tree-node-title__root" onClick={onRootClick}>
        {onAdd && <PlusOutlined />}
        <div className="tree-node-title__text">{title}</div>
        <div className="tree-node-title__buttons">
            {
                onDelete && <Popconfirm
                    title="Are you sure to delete this task?"
                    onConfirm={onDelete}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button className="button" onClick={onDeleteClick}><DeleteOutlined /></Button>
                </Popconfirm>}
        </div>
    </div>;
};

export default TreeNodeTitle;