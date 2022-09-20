import { SortOrder } from 'antd/lib/table/interface';
import {getDate, getMonth} from 'date-fns';
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
};

export function fromListToDatesMap<T extends MayHaveCreateDate>(list : T[], mode: 'month' | 'year'): Record<number, T[]> {
  let result = {} as Record<number, T[]>;
  let getter = mode === 'month' ? getDate : getMonth;

  list.forEach(item => {
    const n = getter(new Date(item.createdAt));
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