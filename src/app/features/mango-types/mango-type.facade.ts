import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { MangoTypeService } from './mango-type.service';
import { MangoTypeDto } from './models/mango-type-dto.model';

@Injectable({ providedIn: 'root' })
export class MangoTypeFacade {
  constructor(private service: MangoTypeService) {}

  getPagedMangoTypes(dto: PagedAndSortedDto): Observable<MangoTypeDto[]> {
    return this.service.getAll(dto).pipe(map(res => res.data));
  }

  getTotalCount(): Observable<number> {
    return this.service.getCount().pipe(map(res => res.data.totalCount));
  }

  getPagedWithCount(dto: PagedAndSortedDto): Observable<[MangoTypeDto[], number]> {
    return forkJoin({
      data: this.getPagedMangoTypes(dto),
      count: this.getTotalCount()
    }).pipe(map(result => [result.data, result.count]));
  }
}