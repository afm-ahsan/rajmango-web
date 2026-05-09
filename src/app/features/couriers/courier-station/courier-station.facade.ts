import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { CourierStationService } from './courier-station.service';
import { CourierStationDto } from './models/courier-station-dto';

@Injectable({ providedIn: 'root' })
export class CourierStationFacade {
  constructor(private service: CourierStationService) {}

  getPagedCourierStations(dto: PagedAndSortedDto): Observable<CourierStationDto[]> {
    return this.service.getAll(dto).pipe(map(res => res.data));
  }

  getTotalCount(): Observable<number> {
    return this.service.getCount().pipe(map(res => res.data));
  }

  getPagedWithCount(dto: PagedAndSortedDto): Observable<[CourierStationDto[], number]> {
    return forkJoin({
      data: this.getPagedCourierStations(dto),
      count: this.getTotalCount()
    }).pipe(map(result => [result.data, result.count]));
  }
}