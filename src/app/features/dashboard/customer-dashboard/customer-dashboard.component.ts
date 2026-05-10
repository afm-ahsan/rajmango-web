import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { CustomerDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  dashboard: CustomerDashboardDto | null = null;

  constructor(
    private dashboardProxy: DashboardServiceProxy,
    private router: Router,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subscribeToRealtime();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.dashboardProxy.getCustomerDashboard().subscribe({
      next: (res: any) => {
        this.dashboard = res?.data ?? null;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  placeOrder(): void {
    this.router.navigate(['/orders/order-list']);
  }

  getOrderStatusLabel(status: any): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getPaymentStatusLabel(status: any): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  private subscribeToRealtime(): void {
    // Order status change affects the customer's active order summary
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => this.load());
    // Payment receipt updates due amount / paid amount
    this.subs.sink = this.signalR.paymentReceived$.subscribe(() => this.load());
    // Catalog changes affect the available mangoes widget
    this.subs.sink = this.signalR.catalogUpdated$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
