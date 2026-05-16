import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import {
  ExpenseSummaryReportDto,
  OrderSummaryReportDto,
  PaymentSummaryReportDto,
  ReportServiceProxy,
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

  constructor(
    private reportProxy: ReportServiceProxy,
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

  loadOrders(): void {
    this.isLoadingOrders = true;
    this.orderReport = null;
    const from = this.fromDate ? moment(this.fromDate) : undefined;
    const to = this.toDate ? moment(this.toDate) : undefined;
    this.subs.sink = this.reportProxy.getOrderSummary(from, to).pipe(
      finalize(() => { this.isLoadingOrders = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.orderReport = res?.data ?? null; },
    });
  }

  loadPayments(): void {
    this.isLoadingPayments = true;
    this.paymentReport = null;
    const from = this.fromDate ? moment(this.fromDate) : undefined;
    const to = this.toDate ? moment(this.toDate) : undefined;
    this.subs.sink = this.reportProxy.getPaymentSummary(from, to).pipe(
      finalize(() => { this.isLoadingPayments = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.paymentReport = res?.data ?? null; },
    });
  }

  loadExpenses(): void {
    this.isLoadingExpenses = true;
    this.expenseReport = null;
    const from = this.fromDate ? moment(this.fromDate) : undefined;
    const to = this.toDate ? moment(this.toDate) : undefined;
    this.subs.sink = this.reportProxy.getExpenseSummary(from, to).pipe(
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
