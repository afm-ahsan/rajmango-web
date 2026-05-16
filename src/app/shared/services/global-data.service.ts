import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalDataService {
  currentOrderSubject$: Observable<any>;
  currentOrderSubject: BehaviorSubject<any>;

  constructor() {
    this.currentOrderSubject = new BehaviorSubject<any>(undefined);
    this.currentOrderSubject$ = this.currentOrderSubject.asObservable();
  }

  get currentRestaurantOrder(): any {
    return this.currentOrderSubject.value;
  }

  updateCurrentRestaurantOrder(orderDto: any) {
    this.currentOrderSubject.next(orderDto);
  }
}
