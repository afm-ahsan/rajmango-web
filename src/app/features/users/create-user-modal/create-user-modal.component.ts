import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { strongPasswordValidator } from 'src/app/shared/validators/password.validator';
import { bdMobileValidator } from 'src/app/shared/validators/bd-mobile.validator';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { FileService } from 'src/app/shared/services/file-service.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import _ from 'underscore';
import { AuthService, ConfirmPasswordValidator } from '../../auth';
import { RoleDto } from '../../roles/models/role-dto.model';
import { RoleService } from '../../roles/role.service';
import { UserDto } from '../models/user-dto.model';
import { UserInputDto } from '../models/user-input-dto.model';
import { UserService } from '../user.service';
import { environment } from 'src/environments/environment';

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

  newImagePath = '';
  oldImagePath = '';
  isUploadingPhoto = false;
  photoError = '';
  avatarLoadError = false;
  backendErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private fileService: FileService,
    private cdRef: ChangeDetectorRef,
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
          this.oldImagePath = this.userDto.imagePath ?? '';
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
          Validators.compose([Validators.required, bdMobileValidator()]),
        ],
        password: [
          '',
          this.userDto.id
            ? Validators.compose([Validators.minLength(6), Validators.maxLength(16), strongPasswordValidator()])
            : Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16), strongPasswordValidator()]),
        ],
        cPassword: [
          '',
          this.userDto.id
            ? Validators.compose([Validators.minLength(6), Validators.maxLength(16)])
            : Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
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
    this.isLoading = true;
    this.backendErrorMessage = '';
    this.subs.sink = this.userService
      .create(this.userInputDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          if (res?.succeeded === false) {
            this.applyBackendErrors(res.messages ?? []);
            this.cdRef.detectChanges();
            return;
          }
          Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
          this.modal.close();
        },
        (error) => {
          this.isLoading = false;
          Swal.fire('Failed', 'User creation failed.', 'error');
          this.cdRef.detectChanges();
        }
      );
  }

  private applyBackendErrors(messages: string[]): void {
    let hasFieldError = false;
    for (const msg of messages) {
      if (msg === 'Email address already exists.') {
        this.formGroup.get('email')!.setErrors({ backendError: msg });
        this.formGroup.get('email')!.markAsTouched();
        hasFieldError = true;
      } else if (
        msg === 'Phone number already exists.' ||
        msg === 'Please enter a valid Bangladesh mobile number.'
      ) {
        this.formGroup.get('phoneNumber')!.setErrors({ backendError: msg });
        this.formGroup.get('phoneNumber')!.markAsTouched();
        hasFieldError = true;
      }
    }
    if (!hasFieldError) {
      this.backendErrorMessage = messages[0] ?? 'An error occurred. Please try again.';
    }
  }

  prepareData() {
    const loggerUserId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.userInputDto.userName = formData.userName;
    this.userInputDto.firstName = formData.firstName;
    this.userInputDto.lastName = formData.lastName;
    this.userInputDto.email = formData.email;
    this.userInputDto.phoneNumber = formData.phoneNumber;
    this.userInputDto.imagePath = this.newImagePath || this.oldImagePath;
    if (!this.userDto.id || formData.password) {
      this.userInputDto.password = formData.password;
    }
    this.userInputDto.isActive = formData.isActive;
    this.userInputDto.roleId = formData.roleId;
    if (this.userDto.id) {
      this.userInputDto.id = this.userDto.id;
      this.userInputDto.createdBy = this.userDto.createdBy;
      this.userInputDto.createdAt = this.userDto.createdAt;
      this.userInputDto.updatedBy = loggerUserId;
    } else {
      this.userInputDto.createdAt = new Date();
      this.userInputDto.createdBy = loggerUserId;
    }
  }

  get currentImagePath(): string {
    return this.newImagePath || this.oldImagePath;
  }

  get hasPhoto(): boolean {
    return !!this.currentImagePath?.trim();
  }

  avatarUrl(): string {
    if (this.avatarLoadError || !this.currentImagePath) {
      return 'assets/media/avatars/blank.png';
    }
    const clean = this.currentImagePath.startsWith('/')
      ? this.currentImagePath.slice(1)
      : this.currentImagePath;
    return `${environment.apis.default.url}/${clean}`;
  }

  onAvatarError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null;
    img.src = 'assets/media/avatars/blank.png';
    this.avatarLoadError = true;
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';

    const previousNew = this.newImagePath;
    this.isUploadingPhoto = true;
    this.photoError = '';
    this.avatarLoadError = false;

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.subs.sink = this.fileService
      .upload(formData, { domain: 'users', prefix: 'user' })
      .subscribe({
        next: (evt: any) => {
          if (evt.type === HttpEventType.Response) {
            const imagePath: string = evt.body?.imagePath;
            if (imagePath) {
              this.newImagePath = imagePath;
              this.isUploadingPhoto = false;
              if (previousNew?.trim()) {
                this.fileService.delete(previousNew).subscribe({ next: () => {}, error: () => {} });
              }
              this.cdRef.detectChanges();
            }
          }
        },
        error: (err: HttpErrorResponse) => {
          this.photoError = err?.error?.message ?? err?.message ?? 'Photo upload failed.';
          this.isUploadingPhoto = false;
          this.cdRef.detectChanges();
        },
      });
  }

  removePhoto(): void {
    const pathToDelete = this.currentImagePath;
    this.newImagePath = '';
    this.oldImagePath = '';
    this.avatarLoadError = false;
    this.photoError = '';
    if (pathToDelete?.trim()) {
      this.fileService.delete(pathToDelete).subscribe({ next: () => {}, error: () => {} });
    }
  }

  initObject(): UserDto {
    return {
      id: 0,
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      phoneNumberConfirmed: false,
      emailConfirmed: false,
      imagePath: '',
      roleName: '',
      roleId: 0,
      isActive: true,
      isDeleted: false,
      createdBy: null,
      updatedBy: null,
      deletedBy: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

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
