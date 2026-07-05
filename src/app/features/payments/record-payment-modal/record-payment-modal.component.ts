import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SubSink } from 'subsink';
import { CreatePaymentCommand, PaymentMethod, PaymentServiceProxy } from 'src/app/services/client-proxy';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { DropdownService } from 'src/app/shared/services/dropdown.service';
import { extractApiErrorMessage } from 'src/app/shared/utils/api-error.utils';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { dropdownRequiredValidator } from 'src/app/shared/validators/dropdown-validators';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { PaymentService } from '../payment.service';
import { OrderPaymentLookupDto } from '../models/order-payment-lookup.model';

@Component({
  selector: 'app-record-payment-modal',
  templateUrl: './record-payment-modal.component.html',
})
export class RecordPaymentModalComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  paymentMethodOptions: DropdownModel[] = [];
  form: FormGroup;

  // ─── Order typeahead ──────────────────────────────────────────────────────
  orderSearchTerm = '';
  orderSearchResults: OrderPaymentLookupDto[] = [];
  isOrderSearching = false;
  selectedOrder: OrderPaymentLookupDto | null = null;
  private orderSearch$ = new Subject<string>();

  readonly PaymentStatus = PaymentStatus;

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private paymentProxy: PaymentServiceProxy,
    private paymentService: PaymentService,
    private dropdownService: DropdownService,
    private cdRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.paymentMethodOptions = this.dropdownService.getPaymentMethodOptions();
    this.form = this.fb.group({
      paidAmount:    [null, [Validators.required, Validators.min(0.01)]],
      paymentMethod: [0,    [dropdownRequiredValidator()]],
      transactionId: [''],
    });

    this.setupOrderSearch();
  }

  private setupOrderSearch(): void {
    this.subs.sink = this.orderSearch$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 3),
      switchMap(term => {
        this.isOrderSearching = true;
        this.cdRef.detectChanges();
        return this.paymentService.orderPaymentLookup(term).pipe(
          catchError(() => of({ data: [] as OrderPaymentLookupDto[] })),
          finalize(() => { this.isOrderSearching = false; this.cdRef.detectChanges(); }),
        );
      }),
    ).subscribe(response => {
      this.orderSearchResults = response?.data ?? [];
      this.cdRef.detectChanges();
    });
  }

  onOrderSearchInput(term: string): void {
    this.orderSearchTerm = term;
    this.orderSearch$.next(term);
    if (!term || term.length < 3) {
      this.orderSearchResults = [];
    }
    if (this.selectedOrder && this.selectedOrder.orderNumber !== term) {
      this.selectedOrder = null;
    }
  }

  selectOrder(order: OrderPaymentLookupDto): void {
    this.selectedOrder = order;
    this.orderSearchTerm = order.orderNumber;
    this.orderSearchResults = [];
    // Pre-fill paid amount with current due amount
    this.form.get('paidAmount')?.setValue(order.dueAmount > 0 ? order.dueAmount : null);
    this.cdRef.detectChanges();
  }

  clearOrder(): void {
    this.selectedOrder = null;
    this.orderSearchTerm = '';
    this.orderSearchResults = [];
    this.form.get('paidAmount')?.setValue(null);
  }

  get isOverpayment(): boolean {
    if (!this.selectedOrder) return false;
    const entered = +this.form.get('paidAmount')?.value;
    return !isNaN(entered) && entered > this.selectedOrder.dueAmount;
  }

  get isAlreadyPaid(): boolean {
    return !!this.selectedOrder && this.selectedOrder.dueAmount <= 0;
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

  getPaymentStatusLabel(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(status);
  }

  save(): void {
    this.form.markAllAsTouched();
    if (!this.selectedOrder) {
      Swal.fire('Required', 'Please search and select an order before recording a payment.', 'warning');
      return;
    }
    if (this.isAlreadyPaid) {
      Swal.fire('Already Paid', 'This order has no outstanding balance.', 'info');
      return;
    }
    if (this.isOverpayment) {
      Swal.fire('Overpayment', 'The amount entered exceeds the current due balance. Please correct the amount.', 'warning');
      return;
    }
    if (this.form.invalid) return;

    const v = this.form.value;
    const command = new CreatePaymentCommand({
      orderId:       this.selectedOrder.orderId,
      paidAmount:    +v.paidAmount,
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
