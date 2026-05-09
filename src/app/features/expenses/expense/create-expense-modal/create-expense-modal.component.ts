import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import _ from 'underscore';
import { ExpenseTypeDto } from '../../expense-type/models/expense-type-dto.model';
import { ExpenseService } from '../expense.service';
import { ExpenseDto } from '../models/expense-dto.model';
import { ExpenseInputDto } from '../models/expense-input-dto.model';

@Component({
  selector: 'app-create-expense-modal',
  templateUrl: './create-expense-modal.component.html',
  styleUrls: ['./create-expense-modal.component.scss'],
})
export class CreateExpenseModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() expenseTypes: ExpenseTypeDto[];

  expenseInputDto: ExpenseInputDto = {} as ExpenseInputDto;
  expenseDto: ExpenseDto = {} as ExpenseDto;
  expenseTypeDto: ExpenseTypeDto = {} as ExpenseTypeDto;
  ddlExpenseTypes: DropdownModel[] = [];
  formGroup: FormGroup;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private expenseService: ExpenseService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadEntity();
    this.loadExpenseType();
  }

  get formControl() {
    return this.formGroup.controls;
  }

  loadEntity() {
    if (!this.id) {
      this.expenseDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.expenseService
        .getItem(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        .subscribe((expenseDto: any) => {
          this.isLoading = false;
          this.expenseDto = expenseDto.data;
          this.loadForm();
        });
    }
  }

  loadExpenseType() {
    if (this.expenseTypes && this.expenseTypes.length) {
      _.each(this.expenseTypes, (item) => {
        this.ddlExpenseTypes.push({
          id: item.id,
          label: item.name,
        });
      });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.expenseDto.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      description: [this.expenseDto.description],
      expenseTypeId: [
        this.expenseDto.expenseTypeId,
        Validators.compose([Validators.required]),
      ],
      amount: [this.expenseDto.amount, Validators.compose([Validators.required])],
      isActive: [this.expenseDto.isActive],
    });
  }

  save() {
    this.prepareData();
    if (this.expenseDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.expenseService
      .update(this.id, this.expenseInputDto)
      .subscribe(
        (respone: ExpenseDto) => {
          this.expenseDto = respone;
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
    this.subs.sink = this.expenseService
      .create(this.expenseInputDto)
      .subscribe(
        (res: ExpenseDto) => {
          this.expenseDto = res;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'Expense creation failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.expenseInputDto.name = formData.name;
    this.expenseInputDto.description = formData.description;
    this.expenseInputDto.expenseTypeId = formData.expenseTypeId;
    this.expenseInputDto.amount = formData.amount;
    this.expenseInputDto.isActive = formData.isActive;
    if (this.expenseDto.id) {
      this.expenseInputDto.id = this.expenseDto.id;
      this.expenseInputDto.createdBy = this.expenseDto.createdBy;
      this.expenseInputDto.createdAt = this.expenseDto.createdAt;
      this.expenseInputDto.updatedBy = loggerUesrId;
    } else {
      this.expenseInputDto.createdAt = new Date();
      this.expenseInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: ExpenseDto = {
      id: 0,
      name: '',
      description: '',
      expenseTypeId: 0,
      amount: 0,
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