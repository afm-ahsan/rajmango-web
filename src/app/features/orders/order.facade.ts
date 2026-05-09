import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { OrderDto } from './models/order-dto.model';
import { OrderService } from './order.service';

@Injectable({ providedIn: 'root' })
export class OrderFacade {
  constructor(private service: OrderService) {}

  getPagedOrders(dto: PagedAndSortedDto): Observable<OrderDto[]> {
    return this.service.getAll(dto).pipe(map(res => res.data));
  }

  getTotalCount(): Observable<number> {
    return this.service.getCount().pipe(map(res => res.data));
  }

  getPagedWithCount(dto: PagedAndSortedDto): Observable<[OrderDto[], number]> {
    return forkJoin({
      data: this.getPagedOrders(dto),
      count: this.getTotalCount()
    }).pipe(map(result => [result.data, result.count]));
  }
}