import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AdminOrderListDto } from '../../orders/models/admin-order-list-dto.model';
import { OrderService } from '../../orders/order.service';

@Component({
  selector: 'app-admin-order-update-status-modal',
  templateUrl: './admin-order-update-status-modal.component.html',
})
export class AdminOrderUpdateStatusModalComponent implements OnInit, OnDestroy {
  @Input() order!: AdminOrderListDto;

  form!: FormGroup;
  isSaving = false;
  errorMessage: string | null = null;

  readonly orderStatusOptions = [
    { value: OrderStatus.Pending,    label: 'Pending' },
    { value: OrderStatus.Confirmed,  label: 'Confirmed' },
    { value: OrderStatus.Processing, label: 'Processing' },
    { value: OrderStatus.Shipped,    label: 'Shipped' },
    { value: OrderStatus.Delivered,  label: 'Delivered' },
    { value: OrderStatus.Cancelled,  label: 'Cancelled' },
    { value: OrderStatus.Returned,   label: 'Returned' },
    { value: OrderStatus.Failed,     label: 'Failed' },
  ];

  readonly paymentStatusOptions = [
    { value: PaymentStatus.Unpaid,   label: 'Unpaid' },
    { value: PaymentStatus.Paid,     label: 'Paid' },
    { value: PaymentStatus.Partial,  label: 'Partial' },
    { value: PaymentStatus.Pending,  label: 'Pending' },
    { value: PaymentStatus.Failed,   label: 'Failed' },
  ];

  readonly paymentMethodOptions = [
    { value: 1,  label: 'Cash' },
    { value: 2,  label: 'Bank Transfer' },
    { value: 3,  label: 'Mobile Payment (bKash/Nagad/Rocket)' },
    { value: 4,  label: 'Credit Card' },
    { value: 5,  label: 'Debit Card' },
    { value: 10, label: 'Admin Adjustment' },
  ];

  readonly PaymentStatus = PaymentStatus;

  readonly deliveryStatusOptions = [
    { value: DeliveryStatus.Pending,    label: 'Pending' },
    { value: DeliveryStatus.Dispatched, label: 'Dispatched' },
    { value: DeliveryStatus.InTransit,  label: 'In Transit' },
    { value: DeliveryStatus.Delivered,  label: 'Delivered' },
    { value: DeliveryStatus.Returned,   label: 'Returned' },
    { value: DeliveryStatus.Cancelled,  label: 'Cancelled' },
  ];

  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      orderStatus:           [this.order.orderStatus,                   Validators.required],
      paymentStatus:         [this.order.paymentStatus,                 Validators.required],
      deliveryStatus:        [this.order.deliveryStatus,                Validators.required],
      deliveryDate:          [this.toDateInputValue(this.order.deliveryDate)],
      shouldNotifyReceiver:  [true],
      shouldNotifySender:    [false],
      manualPaymentMethod:   [10],
      adminPaymentNote:      [''],
    });

    // Rule 4: mutually exclusive — checking one unchecks the other.
    this.subs.sink = this.form.get('shouldNotifyReceiver')!.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('shouldNotifySender')!.setValue(false, { emitEvent: false });
      }
    });
    this.subs.sink = this.form.get('shouldNotifySender')!.valueChanges.subscribe(value => {
      if (value) {
        this.form.get('shouldNotifyReceiver')!.setValue(false, { emitEvent: false });
      }
    });
  }

  private toDateInputValue(value: string | null | undefined): string | null {
    if (!value) return null;
    return value.substring(0, 10);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid || this.isSaving) return;

    this.errorMessage = null;
    this.isSaving = true;

    const { orderStatus, paymentStatus, deliveryStatus, deliveryDate,
            shouldNotifyReceiver, shouldNotifySender,
            manualPaymentMethod, adminPaymentNote } = this.form.value;

    this.subs.sink = this.orderService.adminUpdateStatus(this.order.orderId, {
      orderStatus,
      paymentStatus,
      deliveryStatus,
      deliveryDate: deliveryDate || null,
      shouldNotifyReceiver,
      shouldNotifySender,
      manualPaymentMethod: paymentStatus === PaymentStatus.Paid ? manualPaymentMethod : null,
      adminPaymentNote: paymentStatus === PaymentStatus.Paid && adminPaymentNote?.trim()
        ? adminPaymentNote.trim() : null,
    }).pipe(
      finalize(() => { this.isSaving = false; this.cdRef.detectChanges(); })
    ).subscribe({
      next: (res: any) => {
        if (res?.succeeded === false) {
          this.errorMessage = res?.messages?.join(' ') ?? 'Update failed.';
          return;
        }
        Swal.fire({
          title: 'Done',
          text: `Order ${this.order.orderNumber} status updated.`,
          icon: 'success',
          heightAuto: false,
          scrollbarPadding: false,
        });
        this.modal.close('success');
      },
      error: (err: any) => {
        this.errorMessage = extractApiErrorMessage(err, 'Update failed. Please try again.');
        this.cdRef.detectChanges();
      }
    });
  }
}
