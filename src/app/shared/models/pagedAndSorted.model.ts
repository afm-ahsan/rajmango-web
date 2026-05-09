export interface PagedAndSortedDto {
  pageNumber: number;
  pageSize: number;
  filter: string;
  sortBy: string,
  sortOrder: string,
  userId: number,
}
