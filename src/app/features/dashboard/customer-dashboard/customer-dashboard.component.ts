import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { CustomerDashboardDto, DashboardServiceProxy } from 'src/app/services/client-proxy';
import { CreateOrderModalComponent } from 'src/app/features/orders/create-order-modal/create-order-modal.component';
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
    private modalService: NgbModal,
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
    const modalRef = this.modalService.open(CreateOrderModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = 0;
    modalRef.result.then(
      (result: string) => { if (result === 'success') this.load(); },
      () => {}
    );
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
