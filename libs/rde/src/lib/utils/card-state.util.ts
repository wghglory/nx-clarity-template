/*
Card View pagination and filter

Convert to API HttpParams =>

{page: 1, pageSize: 9, filter: 'name==*aaa*;productionDate==*bbb*', sortAsc: 'description'}
*/
import { pickBy } from 'lodash';

import { PageQuery } from '../models/page-query';

const DEFAULT_PAGE_SIZE = 9;

export interface CardState {
  current: number;
  filters?: any[];
}

export function cardStateHandler(state: CardState) {
  const { page, pageSize } = pageHandler(state);
  const filter = filterHandler(state);

  return pickBy<PageQuery>({ page, pageSize, filter }, Boolean);
}

function pageHandler(state: CardState) {
  const page = state.current;
  const pageSize = DEFAULT_PAGE_SIZE;

  return { page, pageSize };
}

function filterHandler(state: CardState) {
  const { filters } = state;
  if (!state || !filters) {
    return '';
  }
  return filters
    .map((filter) => {
      const { property, value } = <{ property: string; value: string }>filter;
      return `${property}==*${value}*`;
    })
    .join(';');
}
