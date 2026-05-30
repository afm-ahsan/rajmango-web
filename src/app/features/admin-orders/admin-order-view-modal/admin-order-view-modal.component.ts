import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SubSink } from 'subsink';
import { OrderService } from '../../orders/order.service';
import { AdminOrderDetailsDto } from '../../orders/models/admin-order-details-dto.model';

@Component({
  selector: 'app-admin-order-view-modal',
  templateUrl: './admin-order-view-modal.component.html',
})
export class AdminOrderViewModalComponent implements OnInit, OnDestroy {
  @Input() orderId!: number;

  order: AdminOrderDetailsDto | null = null;
  isLoading = false;

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadOrder(): void {
    this.isLoading = true;
    this.subs.sink = this.orderService.getAdminDetails(this.orderId).pipe(
      finalize(() => { this.isLoading = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => { this.order = res?.data ?? null; },
      error: () => { this.order = null; }
    });
  }

  getOrderStatusLabel(s: OrderStatus): string   { return EnumLabelUtils.getOrderStatusLabel(s); }
  getPaymentStatusLabel(s: PaymentStatus): string { return EnumLabelUtils.getPaymentStatusLabel(s); }
  getDeliveryStatusLabel(s: DeliveryStatus): string { return EnumLabelUtils.getDeliveryStatusLabel(s); }
  getPaymentMethodLabel(m: number): string        { return EnumLabelUtils.getPaymentMethodLabel(m); }
  getCrateTypeLabel(t: number): string            { return EnumLabelUtils.getCrateTypeLabel(t); }

  getOrderStatusBadgeClass(status: OrderStatus): string {
    const classes: Record<number, string> = {
      [OrderStatus.Pending]:    'badge-light-warning',
      [OrderStatus.Confirmed]:  'badge-light-info',
      [OrderStatus.Processing]: 'badge-light-primary',
      [OrderStatus.Shipped]:    'badge-light-primary',
      [OrderStatus.Delivered]:  'badge-light-success',
      [OrderStatus.Cancelled]:  'badge-light-danger',
      [OrderStatus.Returned]:   'badge-light-warning',
      [OrderStatus.Failed]:     'badge-light-danger',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    const classes: Record<number, string> = {
      [PaymentStatus.Unpaid]:    'badge-light-danger',
      [PaymentStatus.Paid]:      'badge-light-success',
      [PaymentStatus.Partial]:   'badge-light-warning',
      [PaymentStatus.Pending]:   'badge-light-warning',
      [PaymentStatus.Failed]:    'badge-light-danger',
      [PaymentStatus.Refunded]:  'badge-light-info',
      [PaymentStatus.Cancelled]: 'badge-light-secondary',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  getDeliveryStatusBadgeClass(status: DeliveryStatus): string {
    const classes: Record<number, string> = {
      [DeliveryStatus.None]:        'badge-light-secondary',
      [DeliveryStatus.Pending]:     'badge-light-warning',
      [DeliveryStatus.Dispatched]:  'badge-light-info',
      [DeliveryStatus.InTransit]:   'badge-light-primary',
      [DeliveryStatus.Delivered]:   'badge-light-success',
      [DeliveryStatus.Failed]:      'badge-light-danger',
      [DeliveryStatus.Returned]:    'badge-light-warning',
      [DeliveryStatus.Cancelled]:   'badge-light-secondary',
    };
    return classes[status] ?? 'badge-light-secondary';
  }
}
