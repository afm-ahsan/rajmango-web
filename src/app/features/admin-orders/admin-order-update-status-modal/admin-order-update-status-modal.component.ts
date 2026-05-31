import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
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
      orderStatus:    [this.order.orderStatus,    Validators.required],
      paymentStatus:  [this.order.paymentStatus,  Validators.required],
      deliveryStatus: [this.order.deliveryStatus, Validators.required],
      deliveryDate:   [null],
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  submit(): void {
    if (this.form.invalid || this.isSaving) return;

    this.errorMessage = null;
    this.isSaving = true;

    const { orderStatus, paymentStatus, deliveryStatus, deliveryDate } = this.form.value;

    this.subs.sink = this.orderService.adminUpdateStatus(this.order.orderId, {
      orderStatus,
      paymentStatus,
      deliveryStatus,
      deliveryDate: deliveryDate || null,
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
        this.errorMessage = err?.error?.messages?.join(' ') ?? 'Update failed. Please try again.';
        this.cdRef.detectChanges();
      }
    });
  }
}
