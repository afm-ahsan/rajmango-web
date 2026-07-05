import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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

  constructor(private httpClient: HttpClient) {}

  addOrder(orderDto: OrderDto) {
    this.addOrderSubject.next(orderDto);
  }

  list(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/order`);
  }

  getById(id: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/order/${id}`);
  }

  getAll(pagedAndSortedDto: PagedAndSortedDto): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', pagedAndSortedDto.pageNumber)
      .set('pageSize', pagedAndSortedDto.pageSize)
      .set('sortBy', pagedAndSortedDto.sortBy)
      .set('sortOrder', pagedAndSortedDto.sortOrder)
      .set('filter', pagedAndSortedDto.filter)
      .set('userId', pagedAndSortedDto.userId);

    return this.httpClient.get(`${this.apiUrl}/order/paged`, { params });
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/order`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/order/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/order/${id}`);
  }

  getCount(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/order/count`);
  }

  overrideCourierCharge(id: number, dto: { overrideAmount: number; note: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/order/${id}/override-courier-charge`, {
      orderId: id,
      courierChargeOverrideAmount: dto.overrideAmount,
      courierChargeNote: dto.note,
    });
  }

  calculatePreview(dto: {
    courierStationId?: number | null;
    orderDetails: { mangoTypeId: number; crateType: number; quantity: number }[];
  }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/order/calculate-preview`, dto);
  }

  trackOrder(dto: { orderNumber: string; phoneNumber: string }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/order/track`, dto);
  }

  // ─── Admin Order Management ───────────────────────────────────────────

  getAdminPaged(filter: AdminOrderFilterModel): Observable<any> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize)
      .set('sortBy', filter.sortBy)
      .set('sortOrder', filter.sortOrder);

    if (filter.orderNumber)           params = params.set('orderNumber', filter.orderNumber);
    if (filter.customerName)          params = params.set('customerName', filter.customerName);
    if (filter.phoneNumber)           params = params.set('phoneNumber', filter.phoneNumber);
    if (filter.orderStatus != null)   params = params.set('orderStatus', filter.orderStatus);
    if (filter.paymentStatus != null) params = params.set('paymentStatus', filter.paymentStatus);
    if (filter.deliveryStatus != null) params = params.set('deliveryStatus', filter.deliveryStatus);
    if (filter.startDate)             params = params.set('startDate', filter.startDate);
    if (filter.endDate)               params = params.set('endDate', filter.endDate);
    if (filter.courierProviderId != null) params = params.set('courierProviderId', filter.courierProviderId);
    if (filter.courierStationId != null)  params = params.set('courierStationId', filter.courierStationId);
    if (filter.mangoType)             params = params.set('mangoType', filter.mangoType);
    if (filter.deliveryArea)          params = params.set('deliveryArea', filter.deliveryArea);
    if (filter.receiverMobile)        params = params.set('receiverMobile', filter.receiverMobile);

    return this.httpClient.get(`${this.apiUrl}/admin/orders`, { params });
  }

  getAdminDetails(id: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/admin/orders/${id}`);
  }

  adminConfirm(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/confirm`, {});
  }

  adminProcess(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/process`, {});
  }

  adminShip(id: number, trackingNumber?: string | null): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/ship`, {
      trackingNumber: trackingNumber ?? null,
    });
  }

  adminDeliver(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/deliver`, {});
  }

  adminCancel(id: number): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/cancel`, {});
  }

  adminUpdateStatus(id: number, dto: {
    orderStatus: number;
    paymentStatus: number;
    deliveryStatus: number;
    deliveryDate: string | null;
    shouldNotifyReceiver?: boolean;
    shouldNotifySender?: boolean;
    manualPaymentMethod?: number | null;
    adminPaymentNote?: string | null;
  }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/${id}/update-status`, dto);
  }

  filterByTitle(title: any): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}?title_like=${title}`);
  }

  // ─── Admin — Create Order for Customer ───────────────────────────────────

  /**
   * Typeahead customer search (min 2 chars, returns up to 20 results).
   * Used in the admin Create Order for Customer flow to select the order owner.
   */
  adminCustomerSearch(q: string): Observable<any> {
    const params = new HttpParams().set('q', q);
    return this.httpClient.get(`${this.apiUrl}/admin/orders/customer-search`, { params });
  }

  /**
   * Create an order on behalf of an existing customer.
   * targetCustomerId = AppUser.Id of the customer who will own the order.
   */
  adminCreateForCustomer(dto: {
    targetCustomerId: number;
    courierStationId?: number | null;
    fallbackAddress?: string | null;
    receiverType: number;
    receiverName?: string | null;
    receiverMobileNumber?: string | null;
    deliveryNote?: string | null;
    orderDetails: { mangoTypeId: number; crateType: number; quantity: number; discount?: number; note?: string }[];
  }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/admin/orders/create-for-customer`, dto);
  }

  /**
   * Permanently delete (soft-delete) an order with audit trail.
   * Admin must supply the exact order number for confirmation.
   */
  adminPermanentDelete(id: number, dto: { confirmOrderNumber: string; reason: string }): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/admin/orders/${id}/permanent-delete`, { body: dto });
  }
}
