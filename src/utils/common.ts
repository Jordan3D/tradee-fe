import { SortOrder } from 'antd/lib/table/interface';
import {getDate, getMonth, format} from 'date-fns';
interface MayHaveId {
  id: string;
}

interface MayHaveCreateDate extends MayHaveId {
  createdAt: Date;
}

export function fromListToIdsAndMap<T extends MayHaveId>(list: T[]): {
  ids: string[],
  map: Record<string, T>
} {
  const result = {
    ids: [],
    map: {}
  } as Readonly<{ ids: string[], map: Record<string, T> }>;
  list.forEach((n) => {
    result.map[n.id] = n;
    result.ids.push(n.id);
  });

  return result;
}

export function fromListToDatesMap<T extends MayHaveCreateDate>(list : T[], mode: 'month' | 'year'): Record<string, T[]> {
  const result = {} as Record<string, T[]>;

  list.forEach(item => {
    const n = format(new Date(item.createdAt), 'month' ? 'MM/dd' : 'MM');
    if(result[n]){
      result[n] = result[n].concat([item]);
    } else {
      result[n] = [item];
    }
  })

  return result;
}

export const sortMap = {
  'ascend': 'ASC',
  'descend': 'DESC'
};

export const sortMapKeys: Record<string, SortOrder> = {
  'ASC': 'ascend',
  'DESC': 'descend'
}