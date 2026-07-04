import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AdminOrderListDto } from '../../orders/models/admin-order-list-dto.model';
import { OrderService } from '../../orders/order.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';

@Component({
  selector: 'app-admin-order-permanent-delete-modal',
  templateUrl: './admin-order-permanent-delete-modal.component.html',
})
export class AdminOrderPermanentDeleteModalComponent implements OnDestroy {
  @Input() order!: AdminOrderListDto;

  reason = '';
  confirmInput = '';
  isDeleting = false;

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  get isConfirmMatching(): boolean {
    return this.confirmInput.trim() === this.order?.orderNumber;
  }

  get canConfirm(): boolean {
    return this.isConfirmMatching && this.reason.trim().length >= 5 && !this.isDeleting;
  }

  getPaymentStatusLabel(status: any): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getOrderStatusLabel(status: any): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  confirm(): void {
    if (!this.canConfirm) return;

    this.isDeleting = true;
    this.cdRef.detectChanges();

    this.subs.sink = this.orderService.adminPermanentDelete(this.order.orderId, {
      confirmOrderNumber: this.confirmInput.trim(),
      reason: this.reason.trim(),
    }).pipe(
      finalize(() => { this.isDeleting = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        if (res?.succeeded) {
          Swal.fire({
            title: 'Order Deleted',
            text: `Order ${this.order.orderNumber} has been permanently deleted.`,
            icon: 'success',
            heightAuto: false,
            scrollbarPadding: false,
          });
          this.modal.close('success');
        } else {
          Swal.fire({
            title: 'Delete Failed',
            text: res?.messages?.[0] ?? 'Order could not be deleted. Please try again.',
            icon: 'error',
            heightAuto: false,
            scrollbarPadding: false,
          });
        }
      },
      error: () => {
        Swal.fire({
          title: 'Delete Failed',
          text: 'An unexpected error occurred. Please try again.',
          icon: 'error',
          heightAuto: false,
          scrollbarPadding: false,
        });
      },
    });
  }

  dismiss(): void {
    this.modal.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
