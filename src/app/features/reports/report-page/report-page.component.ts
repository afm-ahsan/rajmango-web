import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import {
  ExpenseSummaryReportDto,
  OrderSummaryReportDto,
  PaymentSummaryReportDto,
} from 'src/app/services/client-proxy';
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

  isLoadingOrders = false;
  isLoadingPayments = false;
  isLoadingExpenses = false;

  orderReport: OrderSummaryReportDto | null = null;
  paymentReport: PaymentSummaryReportDto | null = null;
  expenseReport: ExpenseSummaryReportDto | null = null;

  isExporting = false;

  private readonly apiBase = `${environment.apis.default.url}/api/reports`;

  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.runReport();
  }

  runReport(): void {
    this.loadOrders();
    this.loadPayments();
    this.loadExpenses();
  }

  private dateParams(): HttpParams {
    let params = new HttpParams();
    if (this.fromDate) params = params.set('from', this.fromDate);
    if (this.toDate)   params = params.set('to',   this.toDate);
    return params;
  }

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.orderReport = null;
    this.subs.sink = this.http.get<any>(`${this.apiBase}/orders`, { params: this.dateParams() }).pipe(
      finalize(() => { this.isLoadingOrders = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.orderReport = res?.data ?? null; },
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

    const url = `${environment.apis.default.url}/api/reports/${type}/export?from=${from}&to=${to}`;
    this.isExporting = true;
    this.http.get(url, { responseType: 'blob' }).subscribe({
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
