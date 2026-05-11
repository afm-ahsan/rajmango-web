import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { CreatePaymentCommand, PaymentMethod, PaymentServiceProxy } from 'src/app/services/client-proxy';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
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

  ngOnInit(): void {
    this.paymentMethodOptions = this.dropdownService.getPaymentMethodOptions();
    this.form = this.fb.group({
      orderId: [this.orderId, [Validators.required, Validators.min(1)]],
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
      next: () => {
        this.isLoading = false;
        Swal.fire('Success', 'Payment recorded successfully.', 'success');
        this.modal.close('success');
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Failed', 'Failed to record payment.', 'error');
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
