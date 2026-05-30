import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CourierRateConfigPagedDto, CourierRateConfigService } from './courier-rate-config.service';
import { CourierRateConfigDto } from './models/courier-rate-config-dto';

@Injectable({ providedIn: 'root' })
export class CourierRateConfigFacade {
  constructor(private service: CourierRateConfigService) {}

  getPagedWithCount(dto: CourierRateConfigPagedDto): Observable<[CourierRateConfigDto[], number]> {
    return forkJoin({
      data: this.service.getAll(dto).pipe(map(res => res?.data ?? [])),
      count: this.service.getCount(dto.filter, dto.locationType, dto.courierProviderId).pipe(map(res => res?.data ?? 0))
    }).pipe(map(result => [result.data, result.count]));
  }
}
