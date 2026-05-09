import { FilterModel } from "../models/filter.model";
import { PagedAndSortedDto } from "../models/pagedAndSorted.model";

export class FilterUtils {
  static updateSort(filter: FilterModel, field: string): FilterModel {
    const sortOrder = filter.sortBy === field
      ? (filter.sortOrder === 'asc' ? 'desc' : 'asc')
      : 'asc';

    return {
      ...filter,
      sortBy: field,
      sortOrder
    };
  }

  static createPagedRequest(filter: FilterModel, searchVal: string): PagedAndSortedDto {
    return {
      pageNumber: filter.pageNumber,
      pageSize: filter.pageSize,
      sortBy: filter.sortBy,
      sortOrder: filter.sortOrder,
      filter: searchVal,
      userId: filter.userId
    };
  }
}