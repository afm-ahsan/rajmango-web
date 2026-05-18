import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { AdminDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  dashboard: AdminDashboardDto | null = null;

  constructor(
    private dashboardProxy: DashboardServiceProxy,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subscribeToRealtime();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.dashboardProxy.getAdminDashboard().pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (res: any) => {
        this.dashboard = res?.data ?? null;
      },
    });
  }

  getOrderStatusLabel(status: number): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getPaymentStatusLabel(status: number): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getOrderStatusBadgeClass(status: number): string {
    const map: Record<number, string> = {
      1: 'badge-light-warning',  // Pending
      2: 'badge-light-info',     // Confirmed
      3: 'badge-light-primary',  // Processing
      4: 'badge-light-primary',  // Shipped
      5: 'badge-light-success',  // Delivered
      6: 'badge-light-danger',   // Cancelled
      7: 'badge-light-warning',  // Returned
      8: 'badge-light-danger',   // Failed
    };
    return map[status] ?? 'badge-light-secondary';
  }

  getPaymentStatusBadgeClass(status: number): string {
    const map: Record<number, string> = {
      1: 'badge-light-danger',   // Unpaid
      2: 'badge-light-success',  // Paid
      3: 'badge-light-warning',  // Partial
      4: 'badge-light-danger',   // Failed
      5: 'badge-light-info',     // Refunded
      6: 'badge-light-secondary',// Cancelled
    };
    return map[status] ?? 'badge-light-secondary';
  }

  private subscribeToRealtime(): void {
    // Reload on any event that changes admin dashboard counters
    this.subs.sink = this.signalR.orderCreated$.subscribe(() => this.load());
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => this.load());
    this.subs.sink = this.signalR.paymentReceived$.subscribe(() => this.load());
    this.subs.sink = this.signalR.complaintSubmitted$.subscribe(() => this.load());
    this.subs.sink = this.signalR.complaintStatusUpdated$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
