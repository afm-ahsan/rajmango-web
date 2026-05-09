import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SubSink } from 'subsink';
import {
  ExpenseSummaryReportDto,
  OrderSummaryReportDto,
  PaymentSummaryReportDto,
  ReportServiceProxy,
} from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';

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

  constructor(
    private reportProxy: ReportServiceProxy,
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
    this.subs.sink = this.reportProxy.getOrderSummary(from, to).subscribe({
      next: (res: any) => {
        this.orderReport = res?.data ?? null;
        this.isLoadingOrders = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoadingOrders = false;
        this.cdRef.detectChanges();
      },
    });
  }

  loadPayments(): void {
    this.isLoadingPayments = true;
    this.paymentReport = null;
    const from = this.fromDate ? moment(this.fromDate) : undefined;
    const to = this.toDate ? moment(this.toDate) : undefined;
    this.subs.sink = this.reportProxy.getPaymentSummary(from, to).subscribe({
      next: (res: any) => {
        this.paymentReport = res?.data ?? null;
        this.isLoadingPayments = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoadingPayments = false;
        this.cdRef.detectChanges();
      },
    });
  }

  loadExpenses(): void {
    this.isLoadingExpenses = true;
    this.expenseReport = null;
    const from = this.fromDate ? moment(this.fromDate) : undefined;
    const to = this.toDate ? moment(this.toDate) : undefined;
    this.subs.sink = this.reportProxy.getExpenseSummary(from, to).subscribe({
      next: (res: any) => {
        this.expenseReport = res?.data ?? null;
        this.isLoadingExpenses = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoadingExpenses = false;
        this.cdRef.detectChanges();
      },
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
