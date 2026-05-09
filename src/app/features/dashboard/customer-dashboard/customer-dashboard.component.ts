import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { CustomerDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.dashboardProxy.getCustomerDashboard().subscribe({
      next: (res: any) => {
        this.dashboard = res?.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
