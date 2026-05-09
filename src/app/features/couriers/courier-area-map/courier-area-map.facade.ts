import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { CourierAreaMapService } from './courier-area-map.service';
import { CourierAreaMapDto } from './models/courier-area-map-dto';

@Injectable({ providedIn: 'root' })
export class CourierAreaMapFacade {
  constructor(private service: CourierAreaMapService) {}

  getPagedCourierAreaMaps(dto: PagedAndSortedDto): Observable<CourierAreaMapDto[]> {
    return this.service.getAll(dto).pipe(map(res => res.data));
  }

  getTotalCount(): Observable<number> {
    return this.service.getCount().pipe(map(res => res.data));
  }

  getPagedWithCount(dto: PagedAndSortedDto): Observable<[CourierAreaMapDto[], number]> {
    return forkJoin({
      data: this.getPagedCourierAreaMaps(dto),
      count: this.getTotalCount()
    }).pipe(map(result => [result.data, result.count]));
  }
}