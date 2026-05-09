import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { ExpenseTypeService } from '../expense-type.service';
import { ExpenseTypeDto } from '../models/expense-type-dto.model';
import { ExpenseTypeInputDto } from '../models/expense-type-input-dto.model';

@Component({
  selector: 'app-create-expense-type-modal',
  templateUrl: './create-expense-type-modal.component.html',
  styleUrls: ['./create-expense-type-modal.component.scss'],
})
export class CreateExpenseTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  expenseTypeInputDto: ExpenseTypeInputDto = {} as ExpenseTypeInputDto;
  expenseTypeDto: ExpenseTypeDto = {} as ExpenseTypeDto;
  formGroup: FormGroup;
  subs = new SubSink();
  uploadResponse: { imagePath: '' };
  photos: string[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private expenseTypeService: ExpenseTypeService
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadEntity();
  }

  loadEntity() {
    if (!this.id) {
      this.expenseTypeDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.expenseTypeService
        .getItem(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        //.subscribe((expenseTypeDto: ExpenseTypeDto) => {
        .subscribe((expenseTypeDto: any) => {
          this.isLoading = false;
          this.expenseTypeDto = expenseTypeDto.data;
          this.loadForm();
        });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.expenseTypeDto.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      description: [this.expenseTypeDto.description],
      isActive: [this.expenseTypeDto.isActive],
    });
  }

  save() {
    this.prepareData();
    if (this.expenseTypeDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.expenseTypeService
      .update(this.id, this.expenseTypeInputDto)
      .subscribe(
        (respone: ExpenseTypeDto) => {
          this.expenseTypeDto = respone;
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
    this.subs.sink = this.expenseTypeService
      .create(this.expenseTypeInputDto)
      .subscribe(
        (res: ExpenseTypeDto) => {
          this.expenseTypeDto = res;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'ExpenseType creation failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.expenseTypeInputDto.name = formData.name;
    this.expenseTypeInputDto.description = formData.description;
    this.expenseTypeInputDto.isActive = formData.isActive;
    if (this.expenseTypeDto.id) {
      this.expenseTypeInputDto.id = this.expenseTypeDto.id;
      this.expenseTypeInputDto.createdBy = this.expenseTypeDto.createdBy;
      this.expenseTypeInputDto.createdAt = this.expenseTypeDto.createdAt;
      this.expenseTypeInputDto.updatedBy = loggerUesrId;
    } else {
      this.expenseTypeInputDto.createdAt = new Date();
      this.expenseTypeInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: ExpenseTypeDto = {
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
