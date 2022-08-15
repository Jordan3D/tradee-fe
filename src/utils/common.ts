interface MayHaveId {
  id: string;
}

export function fromListToIdsAndMap<T extends MayHaveId> (list: T[]): {
  ids: string[],
  map: Record<string, T>
}  {
    const result = {
      ids: [],
      map: {}
    } as Readonly<{ ids: string[], map: Record<string, T> }>;
    list.forEach((n) => {
      result.map[n.id] = n;
      result.ids.push(n.id);
    });
  
    return result;
  };
