import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-refund-modal',
  templateUrl: './refund-modal.component.html',
})
export class RefundModalComponent implements OnInit, OnDestroy {
  /** Row object from payment-list: { id, orderNumber, customerName, transactionId, paidAmount } */
  @Input() payment: any;

  subs = new SubSink();
  isSubmitting = false;
  form: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      reason: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  get f() { return this.form.controls; }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    Swal.fire({
      title: 'Confirm Refund',
      html: `Refund <b>৳${this.payment.paidAmount}</b> to the customer for order <b>${this.payment.orderNumber}</b>?<br>This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Refund',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      heightAuto: false,
      scrollbarPadding: false,
    }).then(result => {
      if (!result.isConfirmed) return;

      this.isSubmitting = true;
      this.subs.sink = this.paymentService.refund(this.payment.id, this.form.value.reason).subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          if (res?.succeeded === false) {
            Swal.fire('Refund Failed', res?.messages?.join(' ') || 'Refund was not confirmed by bKash.', 'error');
            return;
          }
          Swal.fire('Refunded', 'Payment refunded successfully.', 'success');
          this.modal.close('success');
        },
        error: (err: any) => {
          this.isSubmitting = false;
          Swal.fire('Refund Failed', extractApiErrorMessage(err, 'Failed to process refund.'), 'error');
        },
      });
    });
  }

  cancel(): void {
    this.modal.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
