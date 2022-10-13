import { DataNode } from "antd/lib/tree";
import { TTagMap } from "../api/tag";
import { ITag, TagWithChildren } from "../interface/Tag";

export const treeAndMapFromList = (list: ITag[]): Readonly<{ tree: TagWithChildren[], map: TTagMap }> => {
    const tree = [] as TagWithChildren[];
    const map = {} as TTagMap;
  
    list.slice().forEach(item => {
      const copidItem = { ...item, children: [] };
      map[item.id] = copidItem;
      if (copidItem.level === 0)
        tree.push(copidItem);
  
      if (copidItem.parentId)
        (map[copidItem.parentId as string].children as TagWithChildren[]).push(copidItem);
  
    })
  
    return {
      tree: tree.sort((a, b) => {
        if (a.title < b.title) {
          return -1;
        }
        if (a.title > b.title) {
          return 1;
        }
        return 0;
      }),
      map
    }
  };

  export const transferToTreeNode = (tagList: ReadonlyArray<TagWithChildren>, parentKey: string): DataNode[] => {
    return tagList.map((tag: TagWithChildren, i: number) => (
      {
        key: parentKey ? parentKey + '-' + i : '' + i,
        title: tag.title,
        children: tag.children ? transferToTreeNode(tag.children, '' + i) : []
      }
    ));
  };