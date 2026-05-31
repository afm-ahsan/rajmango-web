import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { environment } from 'src/environments/environment';
import { OrderDto } from './models/order-dto.model';
import { AdminOrderFilterModel } from './models/admin-order-list-dto.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl: string = `${environment.apis.default.url}/api`;
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  addOrderSubject = new Subject<OrderDto>();
  //removeOrderSubject = new Subject<OrderDto>();
  //currentOrder = this.addOrderSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  addOrder(orderDto: OrderDto) {
    this.addOrderSubject.next(orderDto);
  }

  // removeOrder(orderDto: OrderDto) {
  //   this.removeOrderSubject.next(orderDto);
  // }

  // Show lists of item
  list(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/order`)
      .pipe(catchError(this.handleError));
  }

  // Create new item
  getById(id: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/order/${id}`)
      .pipe(catchError(this.handleError));
  }

  //'https://localhost:7213/api/order-information/paged?pageNumber=1&pageSize=10'
  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    var params = new HttpParams();
    params = params.set('pageNumber', pagedAndSortedDto.pageNumber);
    params = params.set('pageSize', pagedAndSortedDto.pageSize);
    params = params.set('sortBy', pagedAndSortedDto.sortBy);
    params = params.set('sortOrder', pagedAndSortedDto.sortOrder);
    params = params.set('filter', pagedAndSortedDto.filter);
    params = params.set('userId', pagedAndSortedDto.userId);
    
    return this.httpClient
      .get(`${this.apiUrl}/order/paged`, { params })
      .pipe(catchError(this.handleError));
  }

  // getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
  //   var params = new HttpParams();
  //   params = params.set('skipCount', pagedAndSortedDto.skipCount);
  //   params = params.set('maxResultCount', pagedAndSortedDto.maxResultCount);
  //   params = params.set('filter', pagedAndSortedDto.filter);
  //   return this.httpClient.get(`${this.apiUrl}/order-information/GetPagedAndSortedResult`, {params}).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  create(data: any): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/order`, data)
      .pipe(catchError(this.handleError));
  }

  // Edit/ Update
  update(id: any, data: any): Observable<any> {
    return this.httpClient
      .put(`${this.apiUrl}/order/${id}`, data)
      .pipe(catchError(this.handleError));
  }

  // Delete
  delete(id: any): Observable<any> {
    return this.httpClient
      .delete(`${this.apiUrl}/order/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Get count
  getCount(): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/order/count`)
      .pipe(catchError(this.handleError));
  }

  overrideCourierCharge(id: number, dto: { overrideAmount: number; note: string }): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/order/${id}/override-courier-charge`, {
        orderId: id,
        courierChargeOverrideAmount: dto.overrideAmount,
        courierChargeNote: dto.note
      })
      .pipe(catchError(this.handleError));
  }

  calculatePreview(dto: { courierStationId?: number | null; orderDetails: { mangoTypeId: number; crateType: number; quantity: number; }[] }): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/order/calculate-preview`, dto)
      .pipe(catchError(this.handleError));
  }

  // ─── Admin Order Management ───────────────────────────────────────────

  getAdminPaged(filter: AdminOrderFilterModel): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize)
      .set('sortBy', filter.sortBy)
      .set('sortOrder', filter.sortOrder);

    if (filter.orderNumber)         params = params.set('orderNumber', filter.orderNumber);
    if (filter.customerName)        params = params.set('customerName', filter.customerName);
    if (filter.phoneNumber)         params = params.set('phoneNumber', filter.phoneNumber);
    if (filter.orderStatus != null) params = params.set('orderStatus', filter.orderStatus);
    if (filter.paymentStatus != null) params = params.set('paymentStatus', filter.paymentStatus);
    if (filter.deliveryStatus != null) params = params.set('deliveryStatus', filter.deliveryStatus);
    if (filter.startDate)           params = params.set('startDate', filter.startDate);
    if (filter.endDate)             params = params.set('endDate', filter.endDate);
    if (filter.courierProviderId != null) params = params.set('courierProviderId', filter.courierProviderId);
    if (filter.courierStationId != null)  params = params.set('courierStationId', filter.courierStationId);
    if (filter.mangoType)           params = params.set('mangoType', filter.mangoType);
    if (filter.courierEligibleOnly) params = params.set('courierEligibleOnly', filter.courierEligibleOnly);
    if (filter.deliveryArea)        params = params.set('deliveryArea', filter.deliveryArea);
    if (filter.receiverMobile)      params = params.set('receiverMobile', filter.receiverMobile);

    return this.httpClient
      .get(`${this.apiUrl}/admin/orders`, { params })
      .pipe(catchError(this.handleError));
  }

  getAdminDetails(id: number): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}/admin/orders/${id}`)
      .pipe(catchError(this.handleError));
  }

  adminConfirm(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/confirm`, {})
      .pipe(catchError(this.handleError));
  }

  adminProcess(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/process`, {})
      .pipe(catchError(this.handleError));
  }

  adminShip(id: number, trackingNumber?: string | null): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/ship`, { trackingNumber: trackingNumber ?? null })
      .pipe(catchError(this.handleError));
  }

  adminDeliver(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/deliver`, {})
      .pipe(catchError(this.handleError));
  }

  adminCancel(id: number): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/cancel`, {})
      .pipe(catchError(this.handleError));
  }

  adminUpdateStatus(id: number, dto: {
    orderStatus: number;
    paymentStatus: number;
    deliveryStatus: number;
    deliveryDate: string | null;
  }): Observable<any> {
    return this.httpClient
      .post(`${this.apiUrl}/admin/orders/${id}/update-status`, dto)
      .pipe(catchError(this.handleError));
  }

// Search By Name
  filterByTitle(title: any): Observable<any> {
    return this.httpClient
      .get(`${this.apiUrl}?title_like=${title}`)
      .pipe(catchError(this.handleError));
  }

  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
