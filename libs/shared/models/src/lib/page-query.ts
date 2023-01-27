export interface PageQuery {
  page: number;
  pageSize: number;
  filter?: string;
  sortAsc?: string;
  sortDesc?: string;
}
