import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { bdMobileValidator } from 'src/app/shared/validators/bd-mobile.validator';
import { catchError, first, of } from 'rxjs';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { CustomerService } from '../customer.service';
import { CustomerDto } from '../models/customer-dto.model';
import { CustomerInputDto } from '../models/customer-input-dto.model';

@Component({
  selector: 'app-create-customer-modal',
  templateUrl: './create-customer-modal.component.html',
  styleUrls: ['./create-customer-modal.component.scss'],
})
export class CreateCustomerModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  customerInputDto: CustomerInputDto = {} as CustomerInputDto;
  customerDto: CustomerDto = {} as CustomerDto;
  formGroup: FormGroup;
  subs = new SubSink();
  isLoading = false;
  
  ddlCustomerTypes: DropdownModel[] = [
    { id: 1, label: 'Walking' },
    { id: 2, label: 'Registered' },
    { id: 3, label: 'Guest' },
    { id: 4, label: 'VIP' },
  ];

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private customerService: CustomerService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadEntity();
  }

  loadEntity() {
    if (!this.id) {
      this.customerDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.customerService
        .getOne(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        //.subscribe((customerDto: CustomerDto) => {
        .subscribe((customerDto: any) => {
          this.isLoading = false;
          this.customerDto = customerDto.data;
          this.loadForm();
        });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.customerDto.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      email: [this.customerDto.email],
      phoneNumber: [this.customerDto.phoneNumber, [bdMobileValidator()]],
      address: [this.customerDto.address],
      isActive: [this.customerDto.isActive],
      customerType: [this.customerDto.customerType],
    });
  }

  save() {
    this.prepareData();
    if (this.customerDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.customerService
      .update(this.id, this.customerInputDto)
      .subscribe(
        (respone: CustomerDto) => {
          this.customerDto = respone;
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
    this.subs.sink = this.customerService
      .create(this.customerInputDto)
      .subscribe(
        (res: CustomerDto) => {
          this.customerDto = res;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'Customer creation failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.customerInputDto.name = formData.name;
    this.customerInputDto.email = formData.email;
    this.customerInputDto.phoneNumber = formData.phoneNumber;
    this.customerInputDto.address = formData.address;
    this.customerInputDto.customerType = formData.customerType;
    this.customerInputDto.isActive = formData.isActive;
    if (this.customerDto.id) {
      this.customerInputDto.id = this.customerDto.id;
      this.customerInputDto.createdBy = this.customerDto.createdBy;
      this.customerInputDto.createdAt = this.customerDto.createdAt;
      this.customerInputDto.updatedBy = loggerUesrId;
    } else {
      this.customerInputDto.createdAt = new Date();
      this.customerInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: CustomerDto = {
      id: 0,
      name: '',
      email: '',
      phoneNumber: '',
      address: '',
      customerType: 1,
      isActive: true,
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
