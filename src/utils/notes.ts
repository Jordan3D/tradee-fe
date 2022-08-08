import { INoteFull } from "../interface/Note";

export const fromListToIdsAndMap = ((list: INoteFull[]) => {
    const result = {
      ids: [],
      map: {}
    } as Readonly<{ ids: string[], map: Record<string, INoteFull> }>;
    list.forEach((n) => {
      result.map[n.id] = n;
      result.ids.push(n.id);
    });
  
    return result;
  })