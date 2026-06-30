import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { CreatePaymentCommand, PaymentMethod, PaymentServiceProxy } from 'src/app/services/client-proxy';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';

@Component({
  selector: 'app-record-payment-modal',
  templateUrl: './record-payment-modal.component.html',
})
export class RecordPaymentModalComponent implements OnInit, OnDestroy {
  @Input() orderId = 0;

  subs = new SubSink();
  isLoading = false;
  paymentMethodOptions: DropdownModel[] = [];
  form: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private paymentProxy: PaymentServiceProxy,
    private dropdownService: DropdownService
  ) {}

  // Server-side OrderId is a 32-bit int — order NUMBERS (e.g. 202606290011) are 12 digits and
  // overflow it, causing a raw model-binding 400 with no useful message. Capping client-side
  // catches the common "typed the order number instead of the ID" mistake before it ever hits the API.
  private static readonly MAX_ORDER_ID = 2147483647;

  ngOnInit(): void {
    this.paymentMethodOptions = this.dropdownService.getPaymentMethodOptions();
    this.form = this.fb.group({
      orderId: [this.orderId, [Validators.required, Validators.min(1), Validators.max(RecordPaymentModalComponent.MAX_ORDER_ID)]],
      paidAmount: [null, [Validators.required, Validators.min(0.01)]],
      paymentMethod: [0, [dropdownRequiredValidator()]],
      transactionId: [''],
    });
  }

  get f() { return this.form.controls; }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  hasError(name: string, error: string): boolean {
    const c = this.form.get(name);
    return !!c && c.hasError(error) && (c.dirty || c.touched);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.value;
    const command = new CreatePaymentCommand({
      orderId: +v.orderId,
      paidAmount: +v.paidAmount,
      paymentMethod: +v.paymentMethod as PaymentMethod,
      transactionId: v.transactionId || undefined,
    });

    this.isLoading = true;
    this.subs.sink = this.paymentProxy.create(command).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result?.succeeded === false) {
          Swal.fire('Failed', result?.messages?.join(' ') || 'Failed to record payment.', 'error');
          return;
        }
        Swal.fire('Success', 'Payment recorded successfully.', 'success');
        this.modal.close('success');
      },
      error: (err: any) => {
        this.isLoading = false;
        Swal.fire('Failed', extractApiErrorMessage(err, 'Failed to record payment.'), 'error');
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
