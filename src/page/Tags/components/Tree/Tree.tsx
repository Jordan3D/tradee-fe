import './style.scss';
import { ReactElement, useEffect, useState, ChangeEvent, useCallback } from 'react';
import { Tree as TreeComponent, TreeProps, Input } from 'antd';
import { DataNode } from 'antd/lib/tree';
import { Tag } from '../../../../interface/Tag';
import { TreeNodeTitle } from './components/TreeNodeTitle';

const { Search } = Input;

const transferData = (tagList: ReadonlyArray<Tag>, parentKey: string): DataNode[] => {
  return tagList.map((tag: Tag, i: number) => (
    {
      key: parentKey ? parentKey + '-' + i : '' + i,
      title: tag.title,
      children: tag.children ? transferData(tag.children, '' + i) : []
    }
  ));
};

const getExpandedKeys = (gData: DataNode[], value: string): string[] => {
  return foo(gData, undefined);
  function foo(gData: DataNode[], parent?: string): string[]{
    return gData.map((n:DataNode) => {
      const res =  n.children ? foo(n.children, n.key as string) : [];
      return (n.title as string).indexOf(value) !== -1 && parent ? res.concat([parent]) : res;
    }).flat();
  }
};

const TagsPage = ({ className, list }: Readonly<{ className?: string, list: ReadonlyArray<Tag> }>): ReactElement => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [gData, setGData] = useState(transferData(list, ''));

  const transferDataWithComponents = useCallback((tagList: ReadonlyArray<Tag>, parentKey: string): DataNode[] => {
    return [
      {
        key: parentKey ? `${parentKey}-0`: 0, 
        title: <TreeNodeTitle onAdd={()=>{}}/>
      }
    ].concat(tagList.map((tag: Tag, i: number) => {
      const index = i+1;
      return  {
        key: parentKey ? parentKey + '-' + index : '' + index,
        title: <TreeNodeTitle title={tag.title} onDelete={() => {}} onEdit={() => {}}/>,
        children: tag.children && tag.children.length ? transferDataWithComponents(tag.children, '' + index) : []
      }
    }));
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value?.toLowerCase();
    const transferedList = transferData(list, '');

    const expandedKeys = getExpandedKeys(transferedList, value);

    if (value) {
      const hasSearchTerm = (n: string) => n.toLowerCase().indexOf(value) !== -1;
      const filterData = (arr: ReadonlyArray<Tag> = []): Tag[] =>
        arr?.filter((t: Tag) => hasSearchTerm(t.title as string) || filterData(t.children)?.length > 0);
      const filteredList = filterData(list).map((t: Tag) => {
        return {
          ...t,
          children: filterData(t.children)
        };
      });

      setGData(transferDataWithComponents(filteredList, ''));
      setExpandedKeys(expandedKeys);
      setSearchValue(value);
      setAutoExpandParent(true);
    } else {
      setGData(transferDataWithComponents(list, ''));
      setExpandedKeys([]);
      setSearchValue("");
      setAutoExpandParent(false);
    }
  }, [list, transferDataWithComponents]);

  const onDragEnter: TreeProps['onDragEnter'] = info => {
    console.log(info);
  };

  const onDrop: TreeProps['onDrop'] = info => {
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
    const data = [...gData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
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
    setGData(data);
  };

  const onExpand = (keys: DataNode["key"][]) => setExpandedKeys(keys as string[])

  useEffect(() => {
    setGData(transferDataWithComponents(list, ''));
  }, [list]);

  return (
    <div className={className}>
      <Search value={searchValue} placeholder="Search by name" onChange={onChange} />
      <TreeComponent
        className={"draggable-tree"}
        draggable
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
};

export default TagsPage;