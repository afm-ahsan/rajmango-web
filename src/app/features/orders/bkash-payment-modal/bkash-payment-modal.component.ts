import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { OrderDto } from '../models/order-dto.model';
import { OrderService } from '../order.service';
import { BkashPaymentService } from '../services/bkash-payment.service';

@Component({
  selector: 'app-bkash-payment-modal',
  templateUrl: './bkash-payment-modal.component.html',
})
export class BkashPaymentModalComponent implements OnInit, OnDestroy {
  @Input() orderId!: number;

  order: OrderDto | null = null;
  isLoadingOrder = false;
  loadError = '';

  isPaying = false;
  errorMessage = '';

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private bkashService: BkashPaymentService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  private loadOrder(): void {
    this.isLoadingOrder = true;
    this.loadError = '';
    this.subs.sink = this.orderService.getById(this.orderId).subscribe({
      next: (res) => {
        const data = res?.data;
        if (!data) {
          this.loadError = 'Order not found.';
          this.isLoadingOrder = false;
          this.cdRef.detectChanges();
          return;
        }
        this.order = {
          ...data,
          orderDetails: (data.orderDetails ?? []).map((detail: any) => ({
            ...detail,
            mangoName: detail.mangoName ?? '—',
            crateName: detail.crateName || EnumLabelUtils.getCrateTypeLabel(detail.crateType),
          })),
        };
        this.isLoadingOrder = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        this.loadError = extractApiErrorMessage(err, 'Failed to load order details. Please try again.');
        this.isLoadingOrder = false;
        this.cdRef.detectChanges();
      },
    });
  }

  // These are only read from the template once `order` is guaranteed loaded (see *ngIf guard).
  get paymentStatusLabel(): string {
    return EnumLabelUtils.getPaymentStatusLabel(this.order!.paymentStatus);
  }

  get orderStatusLabel(): string {
    return EnumLabelUtils.getOrderStatusLabel(this.order!.orderStatus);
  }

  get deliveryStatusLabel(): string {
    return EnumLabelUtils.getDeliveryStatusLabel(this.order!.deliveryStatus);
  }

  getPaymentStatusBadgeClass(): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(this.order!.paymentStatus);
  }

  getOrderStatusBadgeClass(): string {
    return EnumLabelUtils.getOrderStatusBadgeClass(this.order!.orderStatus);
  }

  getDeliveryStatusBadgeClass(): string {
    return EnumLabelUtils.getDeliveryStatusBadgeClass(this.order!.deliveryStatus);
  }

  payNow(): void {
    if (!this.order) return;
    this.errorMessage = '';
    this.isPaying = true;
    this.subs.sink = this.bkashService.initiate(this.order.id).pipe(
      finalize(() => { this.isPaying = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (result) => {
        if (result?.succeeded && result?.data?.bkashUrl) {
          window.location.href = result.data.bkashUrl;
        } else {
          this.errorMessage = (result?.messages?.length ? result.messages.join(' ') : '')
            || 'Payment initiation failed. Please try again.';
        }
      },
      error: (err) => {
        this.errorMessage = extractApiErrorMessage(err, 'Payment initiation failed. Please try again.');
      },
    });
  }

  retryLoad(): void {
    this.loadOrder();
  }

  cancel(): void {
    this.modal.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
