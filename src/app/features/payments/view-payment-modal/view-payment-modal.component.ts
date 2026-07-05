import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-view-payment-modal',
  templateUrl: './view-payment-modal.component.html',
})
export class ViewPaymentModalComponent implements OnInit, OnDestroy {
  @Input() id: number;

  subs = new SubSink();
  isLoading = false;
  payment: any = null;

  constructor(
    public modal: NgbActiveModal,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.paymentService.getById(this.id).subscribe({
      next: (res: any) => {
        this.payment = res?.data ?? null;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Failed', 'Could not load payment details.', 'error');
        this.modal.dismiss();
      },
    });
  }

  getPaymentStatusLabel(status: any): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: any): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(status);
  }

  getPaymentMethodLabel(method: any): string {
    return EnumLabelUtils.getPaymentMethodLabel(method);
  }

  close(): void {
    this.modal.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
