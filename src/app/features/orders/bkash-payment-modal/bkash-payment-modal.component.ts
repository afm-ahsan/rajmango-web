import { Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { OrderDto } from '../models/order-dto.model';
import { BkashPaymentService } from '../services/bkash-payment.service';

@Component({
  selector: 'app-bkash-payment-modal',
  templateUrl: './bkash-payment-modal.component.html',
})
export class BkashPaymentModalComponent implements OnDestroy {
  private _order!: OrderDto;

  @Input() set order(value: OrderDto) {
    if (!value) return;
    this._order = {
      ...value,
      orderDetails: (value.orderDetails ?? []).map(detail => ({
        ...detail,
        mangoName: detail.mangoName ?? '—',
        crateName: detail.crateName || EnumLabelUtils.getCrateTypeLabel(detail.crateType),
      })),
    };
  }

  get order(): OrderDto {
    return this._order;
  }

  isPaying = false;
  errorMessage = '';

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private bkashService: BkashPaymentService
  ) {}

  get paymentStatusLabel(): string {
    return EnumLabelUtils.getPaymentStatusLabel(this.order?.paymentStatus);
  }

  get orderStatusLabel(): string {
    return EnumLabelUtils.getOrderStatusLabel(this.order?.orderStatus);
  }

  get deliveryStatusLabel(): string {
    return EnumLabelUtils.getDeliveryStatusLabel(this.order?.deliveryStatus);
  }

  getPaymentStatusBadgeClass(): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(this.order?.paymentStatus);
  }

  getOrderStatusBadgeClass(): string {
    return EnumLabelUtils.getOrderStatusBadgeClass(this.order?.orderStatus);
  }

  payNow(): void {
    this.errorMessage = '';
    this.isPaying = true;
    this.subs.sink = this.bkashService.initiate(this.order.id).subscribe({
      next: (result) => {
        this.isPaying = false;
        if (result?.isSuccess && result?.data?.bkashUrl) {
          window.location.href = result.data.bkashUrl;
        } else {
          this.errorMessage = result?.message || 'Payment initiation failed. Please try again.';
        }
      },
      error: (err) => {
        this.isPaying = false;
        this.errorMessage = err?.error?.message || 'An error occurred. Please try again.';
      },
    });
  }

  cancel(): void {
    this.modal.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
