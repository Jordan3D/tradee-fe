import './style.scss';
import { memo, ReactElement, useEffect, useState, ChangeEvent, useCallback, useContext } from 'react';
import { Tree as TreeComponent, TreeProps, Input, Button } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { TagWithChildren } from '../../../../interface/Tag';
import { TreeNodeTitle } from './components/TreeNodeTitle';
import { GlobalContext } from '../../../../state/context';
import { selectTagTree } from '../../../../store/common/tags';
import { useSelector } from 'react-redux';
import { transferToTreeNode } from '../../../../utils/tags';
import { getKeysByTitleMatchValue } from '../../../../utils/tree/tree';

const { Search } = Input;

type Props = Readonly<{
  className?: string,
  onSetForm: (value: any) => () => void,
}>

const Tree = memo(function Tree({ className, onSetForm }: Props): ReactElement {
  const tagTree = useSelector(selectTagTree);
  const { tagDeleteHandler } = useContext(GlobalContext);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [gData, setGData] = useState(transferToTreeNode(tagTree, ''));

  const transferDataWithComponents = useCallback((tagList: ReadonlyArray<TagWithChildren>, parentKey?: string, parentId?: string): DataNode[] => {

    const onDeleteTag = (id: string) => () => tagDeleteHandler(id);

    return tagList.map((tag: TagWithChildren, i: number) => {
      const index = i + 1;
      const key = parentKey ? parentKey + '-' + index : '' + index;
      return {
        key,
        title: <TreeNodeTitle
          title={tag.title} onDelete={onDeleteTag(tag.id)} onEdit={onSetForm({ parentId, id: tag.id })} onAdd={onSetForm({ parentId: tag.id, id: 'new' })} />,
        children: tag.children && tag.children.length ? transferDataWithComponents(tag.children, key, tag.id) : []
      }
    });
  }, [tagDeleteHandler, onSetForm]);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.toLowerCase();
    const transferedList = transferToTreeNode(tagTree, '');

    const expandedKeys = getKeysByTitleMatchValue(transferedList, value);

    if (value) {
      const hasSearchTerm = (n: string) => n.toLowerCase().indexOf(value) !== -1;
      const filterData = (arr: ReadonlyArray<TagWithChildren> = []): TagWithChildren[] =>
        arr?.filter((t: TagWithChildren) => hasSearchTerm(t.title as string) || filterData(t.children)?.length > 0);
      const filteredList = filterData(tagTree).map((t: TagWithChildren) => {
        return {
          ...t,
          children: filterData(t.children)
        };
      });

      setGData(transferDataWithComponents(filteredList));
      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setGData(transferDataWithComponents(tagTree));
      setExpandedKeys([]);
      setSearchValue("");
      setAutoExpandParent(false);
    }
  }, [tagTree, transferDataWithComponents]);

  const onDragEnter: TreeProps['onDragEnter'] = info => {
    console.log(info);
  };

  const onDrop: TreeProps['onDrop'] = useCallback((info: any) => {

    const splitedKey = (info.dragNode.key as string).split('');
    if (splitedKey.pop() === '0') {
      return;
    }

    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };

    setGData((gData) => {
      const data = [...gData];
      let dragObj: DataNode;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert
          item.children.unshift(dragObj);
        });
      } else if (
        ((info.node as any).props.children || []).length > 0 && // Has children
        (info.node as any).props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert
          item.children.unshift(dragObj);
          // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
        });
      } else {
        let ar: DataNode[] = [];
        let i: number;
        loop(data, dropKey, (_item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i!, 0, dragObj!);
        } else {
          ar.splice(i! + 1, 0, dragObj!);
        }
      }
      return data;
    })
  }, [setGData]);

  const onExpand = (keys: DataNode["key"][]) => setExpandedKeys(keys as string[]);

  const onAddClick = () => {
    onSetForm({ id: 'new' })();
  }

  useEffect(() => {
    setGData(transferDataWithComponents(tagTree, ''));
  }, [tagTree, transferDataWithComponents]);

  return (
    <div className={`${className} tree-root`}>
      <Search value={searchValue} placeholder="Search by name" onChange={onChange} />
      <div className="tree-add-item-container">
        <Button onClick={onAddClick}>Add new tag</Button>
      </div>
      <TreeComponent
        className={"draggable-tree"}
        blockNode
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        autoExpandParent={autoExpandParent}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={gData}
      />
    </div>
  );
});

export default Tree;