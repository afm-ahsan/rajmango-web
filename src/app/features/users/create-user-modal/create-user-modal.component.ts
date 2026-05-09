import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import _ from 'underscore';
import { AuthService, ConfirmPasswordValidator } from '../../auth';
import { RoleDto } from '../../roles/models/role-dto.model';
import { RoleService } from '../../roles/role.service';
import { UserDto } from '../models/user-dto.model';
import { UserInputDto } from '../models/user-input-dto.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss'],
})
export class CreateUserModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() roles: RoleDto[];

  userInputDto: UserInputDto = {} as UserInputDto;
  userDto: UserDto = {} as UserDto;
  roleDto: RoleDto = {} as RoleDto;
  ddlRoles: DropdownModel[] = [];
  formGroup: FormGroup;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    this.loadForm();
    this.loadEntity();
    this.loadRole();
  }

  get formControl() {
    return this.formGroup.controls;
  }

  onRoleSelected(e: any) {
    console.log(e.target.value);
    var item = _.find(this.roles, (item) => {
      return item.id == parseInt(e.target.value);
    });
    if (item) {
      this.roleDto = item;
      this.roleService.addRole(this.roleDto);
    }
  }

  roleAdded = (event: any) => {
    if (event) {
      this.formGroup.patchValue({
        cost: event.cost ?? 0,
        price: event.price ?? 0,
      });
    }
  };

  loadEntity() {
    if (!this.id) {
      this.userDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.userService
        .getItem(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        .subscribe((userDto: any) => {
          this.isLoading = false;
          this.userDto = userDto.data;
          this.loadForm();
        });
    }
  }

  loadRole() {
    if (this.roles && this.roles.length) {
      _.each(this.roles, (item) => {
        this.ddlRoles.push({
          id: item.id,
          label: item.name,
        });
      });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group(
      {
        userName: [
          this.userDto.userName,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        firstName: [
          this.userDto.firstName,
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ]),
        ],
        lastName: [this.userDto.lastName],
        email: [
          this.userDto.email,
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320),
          ]),
        ],
        phoneNumber: [
          this.userDto.phoneNumber,
          Validators.compose([Validators.required]),
        ],
        password: [
          this.userDto.password,
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
          ]),
        ],

        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(16),
          ]),
        ],
        isActive: [this.userDto.isActive],
        roleId: [this.userDto.roleId],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  save() {
    this.prepareData();
    if (this.userDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.userService
      .update(this.id, this.userInputDto)
      .subscribe(
        (respone: UserDto) => {
          this.userDto = respone;
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
    this.subs.sink = this.userService
      .create(this.userInputDto)
      .subscribe(
        (res: UserDto) => {
          this.userDto = res;
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.modal.dismiss(error);
          Swal.fire('Failed', 'User creation failed.', 'error');
          return of(this.initObject());
        }
      );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.userInputDto.userName = formData.userName;
    this.userInputDto.firstName = formData.firstName;
    this.userInputDto.lastName = formData.lastName;
    this.userInputDto.email = formData.email;
    this.userInputDto.phoneNumber = formData.phoneNumber;
    this.userInputDto.password = formData.password;
    this.userInputDto.isActive = formData.isActive;
    this.userInputDto.roleId = formData.roleId;
    if (this.userDto.id) {
      this.userInputDto.id = this.userDto.id;
      this.userInputDto.createdBy = this.userDto.createdBy;
      this.userInputDto.createdAt = this.userDto.createdAt;
      this.userInputDto.updatedBy = loggerUesrId;
    } else {
      this.userInputDto.createdAt = new Date();
      this.userInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: UserDto = {
      id: 0,
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordHash: '',
      phoneNumberConfirmed: false,
      emailConfirmed: false,
      accessFailedCount: 0,
      roleId: 0,
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
