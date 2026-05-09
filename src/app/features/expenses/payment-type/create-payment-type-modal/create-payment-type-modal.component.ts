import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { PaymentMethodDto } from '../models/payment-method-dto.model';
import { PaymentMethodInputDto } from '../models/payment-method-input-dto.model';
import { PaymentTypeService } from '../payment-type.service';

@Component({
  selector: 'app-create-payment-type-modal',
  templateUrl: './create-payment-type-modal.component.html',
  styleUrls: ['./create-payment-type-modal.component.scss'],
})
export class CreatePaymentTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  paymentTypeInputDto: PaymentMethodInputDto = {} as PaymentMethodInputDto;
  paymentTypeDto: PaymentMethodDto = {} as PaymentMethodDto;
  formGroup: FormGroup;
  subs = new SubSink();
  uploadResponse: { imagePath: '' };
  photos: string[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private paymentTypeService: PaymentTypeService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadEntity();
  }

  loadEntity() {
    if (!this.id) {
      this.paymentTypeDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.paymentTypeService
        .getItem(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        //.subscribe((paymentTypeDto: PaymentTypeDto) => {
        .subscribe((paymentTypeDto: any) => {
          this.isLoading = false;
          this.paymentTypeDto = paymentTypeDto.data;
          this.loadForm();
        });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.paymentTypeDto.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      description: [this.paymentTypeDto.description],
      isActive: [this.paymentTypeDto.isActive],
    });
  }

  save() {
    this.prepareData();
    if (this.paymentTypeDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.paymentTypeService
      .update(this.id, this.paymentTypeInputDto)
      .subscribe(
        (respone: PaymentMethodDto) => {
          this.paymentTypeDto = respone;
          Swal.fire('SUCCESS', 'Data updated successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'Data update failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  create() {
    this.subs.sink = this.paymentTypeService
      .create(this.paymentTypeInputDto)
      .subscribe(
        (res: PaymentMethodDto) => {
          this.paymentTypeDto = res;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'PaymentType creation failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.paymentTypeInputDto.name = formData.name;
    this.paymentTypeInputDto.description = formData.description;
    this.paymentTypeInputDto.isActive = formData.isActive;
    if (this.paymentTypeDto.id) {
      this.paymentTypeInputDto.id = this.paymentTypeDto.id;
      this.paymentTypeInputDto.createdBy = this.paymentTypeDto.createdBy;
      this.paymentTypeInputDto.createdAt = this.paymentTypeDto.createdAt;
      this.paymentTypeInputDto.updatedBy = loggerUesrId;
    } else {
      this.paymentTypeInputDto.createdAt = new Date();
      this.paymentTypeInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: PaymentMethodDto= {
      id: 0,
      name: '',
      description: '',
      isActive: true,
      isDeleted: true,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };
    return EMPTY_ENTITY;
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
