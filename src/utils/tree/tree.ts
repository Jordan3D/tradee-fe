import { DataNode } from "antd/lib/tree";

export const getKeysByTitleMatchValue = (gData: DataNode[], value = ''): string[] => {
    return foo(gData, undefined);
    function foo(gData: DataNode[], parent?: string): string[] {
      return gData.map((n: DataNode) => {
        const res = n.children ? foo(n.children, n.key as string) : [];
        return (n.title as string).indexOf(value) !== -1 && parent ? res.concat([parent]) : res;
      }).flat();
    }
  };