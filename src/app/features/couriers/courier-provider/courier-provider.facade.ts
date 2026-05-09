import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { CourierProviderService } from './courier-provider.service';
import { CourierProviderDto } from './models/courier-provider-dto';

@Injectable({ providedIn: 'root' })
export class CourierProviderFacade {
  constructor(private service: CourierProviderService) {}

  getPagedCourierProviders(dto: PagedAndSortedDto): Observable<CourierProviderDto[]> {
    return this.service.getAll(dto).pipe(map(res => res.data));
  }

  getTotalCount(): Observable<number> {
    return this.service.getCount().pipe(map(res => res.data));
  }

  getPagedWithCount(dto: PagedAndSortedDto): Observable<[CourierProviderDto[], number]> {
    return forkJoin({
      data: this.getPagedCourierProviders(dto),
      count: this.getTotalCount()
    }).pipe(map(result => [result.data, result.count]));
  }
}