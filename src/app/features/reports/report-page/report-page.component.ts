import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import {
  ExpenseSummaryReportDto,
  OrderSummaryReportDto,
  PaymentSummaryReportDto,
} from 'src/app/services/client-proxy';
import { MangoTypeService } from 'src/app/features/mango-types/mango-type.service';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
})
export class ReportPageComponent implements OnInit, OnDestroy {
  subs = new SubSink();

  activeTab: 'orders' | 'payments' | 'expenses' = 'orders';

  fromDate: string = moment().startOf('month').format('YYYY-MM-DD');
  toDate: string = moment().format('YYYY-MM-DD');

  // Run only after the user clicks "Run Report" — nothing loads on page open.
  hasRun = false;

  isLoadingOrders = false;
  isLoadingPayments = false;
  isLoadingExpenses = false;

  orderReport: OrderSummaryReportDto | null = null;
  paymentReport: PaymentSummaryReportDto | null = null;
  expenseReport: ExpenseSummaryReportDto | null = null;

  isExporting = false;
  isExportingPdf = false;

  // Order Lines filters (mirrors admin-orders/list)
  showOrderFilters = false;
  orderFilter = {
    customerName: '',
    orderStatus: null as number | null,
    paymentStatus: null as number | null,
    deliveryStatus: null as number | null,
    mangoType: '',
  };
  mangoTypeOptions: { id: number; name: string }[] = [];

  readonly orderStatusOptions = [
    { value: OrderStatus.Pending,    label: 'Pending' },
    { value: OrderStatus.Confirmed,  label: 'Confirmed' },
    { value: OrderStatus.Processing, label: 'Processing' },
    { value: OrderStatus.Shipped,    label: 'Shipped' },
    { value: OrderStatus.Delivered,  label: 'Delivered' },
    { value: OrderStatus.Cancelled,  label: 'Cancelled' },
    { value: OrderStatus.Returned,   label: 'Returned' },
    { value: OrderStatus.Failed,     label: 'Failed' },
  ];

  readonly paymentStatusOptions = [
    { value: PaymentStatus.Unpaid,  label: 'Unpaid' },
    { value: PaymentStatus.Paid,    label: 'Paid' },
    { value: PaymentStatus.Partial, label: 'Partial' },
    { value: PaymentStatus.Pending, label: 'Pending' },
    { value: PaymentStatus.Failed,  label: 'Failed' },
  ];

  readonly deliveryStatusOptions = [
    { value: DeliveryStatus.Pending,    label: 'Pending' },
    { value: DeliveryStatus.Dispatched, label: 'Dispatched' },
    { value: DeliveryStatus.InTransit,  label: 'In Transit' },
    { value: DeliveryStatus.Delivered,  label: 'Delivered' },
    { value: DeliveryStatus.Returned,   label: 'Returned' },
    { value: DeliveryStatus.Cancelled,  label: 'Cancelled' },
  ];

  // Order Lines pagination
  ordersPageNumber = 1;
  ordersPageSize = 10;
  ordersTotalCount = 0;

  private readonly apiBase = `${environment.apis.default.url}/api/reports`;

  constructor(
    private http: HttpClient,
    private mangoTypeService: MangoTypeService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadMangoTypeOptions();
  }

  private loadMangoTypeOptions(): void {
    this.subs.sink = this.mangoTypeService.list().subscribe({
      next: (res: any) => { this.mangoTypeOptions = Array.isArray(res) ? res : (res?.data ?? []); },
      error: () => {},
    });
  }

  runReport(): void {
    this.hasRun = true;
    this.ordersPageNumber = 1;
    this.loadOrders();
    this.loadPayments();
    this.loadExpenses();
  }

  toggleOrderFilters(): void {
    this.showOrderFilters = !this.showOrderFilters;
  }

  applyOrderFilters(): void {
    this.ordersPageNumber = 1;
    this.loadOrders();
  }

  clearOrderFilters(): void {
    this.orderFilter = {
      customerName: '',
      orderStatus: null,
      paymentStatus: null,
      deliveryStatus: null,
      mangoType: '',
    };
    this.ordersPageNumber = 1;
    this.loadOrders();
  }

  ordersPageChanged(page: number): void {
    this.ordersPageNumber = page;
    this.loadOrders();
  }

  ordersPageSizeChanged(size: number): void {
    this.ordersPageNumber = 1;
    this.ordersPageSize = size;
    this.loadOrders();
  }

  private dateParams(): HttpParams {
    let params = new HttpParams();
    if (this.fromDate) params = params.set('from', this.fromDate);
    if (this.toDate)   params = params.set('to',   this.toDate);
    return params;
  }

  private orderFilterParams(includePaging: boolean): HttpParams {
    let params = this.dateParams();
    if (this.orderFilter.customerName)        params = params.set('customerName', this.orderFilter.customerName);
    if (this.orderFilter.orderStatus != null)    params = params.set('orderStatus', this.orderFilter.orderStatus);
    if (this.orderFilter.paymentStatus != null)  params = params.set('paymentStatus', this.orderFilter.paymentStatus);
    if (this.orderFilter.deliveryStatus != null) params = params.set('deliveryStatus', this.orderFilter.deliveryStatus);
    if (this.orderFilter.mangoType)              params = params.set('mangoType', this.orderFilter.mangoType);
    if (includePaging) {
      params = params.set('pageNumber', this.ordersPageNumber);
      params = params.set('pageSize', this.ordersPageSize);
    }
    return params;
  }

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.orderReport = null;
    this.subs.sink = this.http.get<any>(`${this.apiBase}/orders`, { params: this.orderFilterParams(true) }).pipe(
      finalize(() => { this.isLoadingOrders = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        this.orderReport = res?.data ?? null;
        this.ordersTotalCount = this.orderReport?.ordersTotalCount ?? 0;
      },
    });
  }

  loadPayments(): void {
    this.isLoadingPayments = true;
    this.paymentReport = null;
    this.subs.sink = this.http.get<any>(`${this.apiBase}/payments`, { params: this.dateParams() }).pipe(
      finalize(() => { this.isLoadingPayments = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.paymentReport = res?.data ?? null; },
    });
  }

  loadExpenses(): void {
    this.isLoadingExpenses = true;
    this.expenseReport = null;
    this.subs.sink = this.http.get<any>(`${this.apiBase}/expenses`, { params: this.dateParams() }).pipe(
      finalize(() => { this.isLoadingExpenses = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.expenseReport = res?.data ?? null; },
    });
  }

  setTab(tab: 'orders' | 'payments' | 'expenses'): void {
    this.activeTab = tab;
  }

  getOrderStatusLabel(status: any): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getPaymentStatusLabel(status: any): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentMethodLabel(method: any): string {
    return EnumLabelUtils.getPaymentMethodLabel(method);
  }

  exportReport(): void {
    const type = this.activeTab;
    const from = this.fromDate;
    const to = this.toDate;
    if (!from || !to) return;

    const params = type === 'orders' ? this.orderFilterParams(false) : this.dateParams();
    const url = `${this.apiBase}/${type}/export`;
    this.isExporting = true;
    this.http.get(url, { params, responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${type}_report_${from}_${to}.xlsx`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.isExporting = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isExporting = false;
        this.cdRef.detectChanges();
      },
    });
  }

  exportOrdersPdf(): void {
    const from = this.fromDate;
    const to = this.toDate;
    if (!from || !to) return;

    this.isExportingPdf = true;
    this.http.get(`${this.apiBase}/orders/export-pdf`, { params: this.orderFilterParams(false), responseType: 'blob' }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `orders_report_${from}_${to}.pdf`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.isExportingPdf = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isExportingPdf = false;
        this.cdRef.detectChanges();
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
