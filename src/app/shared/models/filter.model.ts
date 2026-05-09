export interface FilterModel {
  offset: number;
  limit: number;
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  isDesc: boolean;
  userId: number;
}
