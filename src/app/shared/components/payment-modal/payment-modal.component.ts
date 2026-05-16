import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { DropdownModel } from '../../models/dropdown.model';
import { PaymentModel } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
})
export class PaymentModalComponent implements OnInit, OnDestroy {
  @Input() orderId: number;
  @Input() paymentModel: PaymentModel;

  paymentInputModel: PaymentModel = {} as PaymentModel;
  formGroup: FormGroup;
  subs = new SubSink();
  isLoading = false;
  isCashPayment = false;
  isCardPayment = false;
  isMobileWallet = false;

  customers: PaymentModel[] = [];
  ddlCustomers: DropdownModel[] = [];
  ddlPayemntMethods: DropdownModel[] = [
    { id: 1, label: 'Cash' },
    { id: 2, label: 'bKash' },
    { id: 3, label: 'Nagad' },
    { id: 4, label: 'Credit Card' },
    { id: 5, label: 'Debit Card' },
  ];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.loadForm();
  }

  loadForm() {
    this.formGroup = this.fb.group({
      orderId: 0,
      paymentMethod: [this.paymentModel.paymentMethod],
      discount: [this.paymentModel.discount],
      recipientAmount: [this.paymentModel.recipientAmount],
      subtotal: [this.paymentModel.subtotal],
      discountAmount: [this.paymentModel.discountAmount],
      vatAmount: [this.paymentModel.vatAmount],
      totalPayable: [this.paymentModel.totalPayable],
      balance: [this.paymentModel.balance],
      cashAmount: [this.paymentModel.cashAmount],
      changeAmount: [this.paymentModel.changeAmount],
      type: [this.paymentModel.type],
      cardType: [this.paymentModel.cardType],
      walletTransactionId: [this.paymentModel.walletTransactionId],
    });

    this.formGroup.controls['recipientAmount'].disable();
    this.formGroup.controls['subtotal'].disable();
    this.formGroup.controls['discountAmount'].disable();
    this.formGroup.controls['vatAmount'].disable();
    this.formGroup.controls['totalPayable'].disable();
    this.formGroup.controls['balance'].disable();
  }

  confirmPayment(): void {
    if (this.formGroup.value.paymentMethod == 0) {
      Swal.fire('', 'Please select a payment method', 'warning');
      return;
    }

    if (
      this.formGroup.value.paymentMethod == 1 &&
      this.formGroup.value.cashAmount < this.paymentModel.totalPayable
    ) {
      Swal.fire('', 'Cash amount can not less than total payable amount', 'warning');
      return;
    }

    if ((this.formGroup.value.paymentMethod == 2 || 
        this.formGroup.value.paymentMethod == 3) &&
        this.formGroup.value.walletTransactionId == '')
        {
          Swal.fire('', 'Please enter wallet transaction number', 'warning');
          return;
        }

    this.isLoading = true;
    this.prepareData();
    this.subs.sink = this.paymentService
      .create(this.paymentInputModel)
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          Swal.fire('SUCCESS', 'Payment Success.', 'success');
          this.modal.close({
            paymentModel: this.paymentInputModel,
          });
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire('Failed', 'Payment Failed.', 'error');
          this.modal.dismiss(error);
        }
      });
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.getRawValue();
    this.paymentInputModel = this.paymentModel;
    this.paymentInputModel.paymentMethod = formData.paymentMethod;
    this.paymentInputModel.cashAmount = formData.cashAmount;
    this.paymentInputModel.changeAmount = formData.changeAmount;
    this.paymentInputModel.type = formData.type;
    this.paymentInputModel.cardType = formData.cardType;
    this.paymentInputModel.walletTransactionId = formData.walletTransactionId;

    if (this.paymentModel.id) {
      this.paymentInputModel.id = this.paymentModel.id;
      this.paymentInputModel.createdBy = this.paymentModel.createdBy;
      this.paymentInputModel.createdAt = this.paymentModel.createdAt;
      this.paymentInputModel.updatedBy = loggerUesrId;
    } else {
      this.paymentInputModel.createdAt = new Date();
      this.paymentInputModel.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: PaymentModel = {
      id: 0,
      orderId: '',
      paymentMethod: 0,
      discount: 0,
      recipientAmount: 0,
      subtotal: 0,
      discountAmount: 0,
      vatAmount: 0,
      totalPayable: 0,
      balance: 0,
      cashAmount: 0,
      changeAmount: 0,
      type: 0,
      cardType: '',
      walletTransactionId: '',
      isDeleted: false,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };
    return EMPTY_ENTITY;
  }

  onMethodChange($event: any) {
    this.isCashPayment = false;
    this.isCardPayment = false;
    this.isMobileWallet = false;

    let paymentMethod = this.formGroup.value.paymentMethod;
    if (paymentMethod == 1) {
      this.isCashPayment = true;
      this.formGroup.controls['changeAmount'].disable();
    }else if (paymentMethod == 2 || paymentMethod == 3) {
      this.isMobileWallet = true;
    }else if (paymentMethod == 4 || paymentMethod == 5) {
      this.isCardPayment = true;
      this.formGroup.patchValue({
        cardType: paymentMethod == 4? 'Credit Card': 'Debit Card'
      });
      this.formGroup.controls['cardType'].disable();
    }
  }

  onCashAmtChange($event: any): void {
    let cashAmt = $event.target.value;
    // if(cashAmt<this.paymentModel.totalPayable){
    //   Swal.fire('', 'Cash amount should be greater than or equal to total payable amount', 'warning');
    //   return;
    // }
    let changeAmt = Math.round(cashAmt - this.paymentModel.totalPayable);
    this.formGroup.patchValue({
      changeAmount: changeAmt,
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string | number): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string | number): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}
