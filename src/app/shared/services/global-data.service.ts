import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RestaurantOrderDto } from '../../restaurant/models/restaurant-order-dto.model';

@Injectable({
  providedIn: 'root',
})
export class GlobalDataService {
  currentOrderSubject$: Observable<RestaurantOrderDto | undefined>;
  currentOrderSubject: BehaviorSubject<RestaurantOrderDto | undefined>;

  constructor() {
    this.currentOrderSubject = new BehaviorSubject<RestaurantOrderDto | undefined>(undefined);
    this.currentOrderSubject$ = this.currentOrderSubject.asObservable();
  }

  get currentRestaurantOrder(): RestaurantOrderDto | undefined {
    return this.currentOrderSubject.value;
  }

  updateCurrentRestaurantOrder(orderDto: RestaurantOrderDto) {
    this.currentOrderSubject.next(orderDto);
  }
}
