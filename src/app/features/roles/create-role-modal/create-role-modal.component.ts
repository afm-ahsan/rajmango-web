import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { PermissionModel } from 'src/app/shared/models/permission.model';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import * as _ from 'underscore';
import { AuthService } from '../../auth/services/auth.service';
import { RoleDto } from '../models/role-dto.model';
import { RoleInputDto } from '../models/role-input-dto.model';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-create-role-modal',
  templateUrl: './create-role-modal.component.html',
  styleUrls: ['./create-role-modal.component.scss'],
})
export class CreateRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  roleInputDto: RoleInputDto = {} as RoleInputDto;
  permissionList: PermissionModel[] = [];
  roleDto: RoleDto = {} as RoleDto;
  formGroup: FormGroup;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private authService: AuthService,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadPermission();
    this.loadEntity();
    this.loadForm();
  }

  loadPermission() {
    this.permissionList = this.permissionService.getPermissionList();
  }

  loadEntity() {
    if (!this.id) {
      this.roleDto = this.initObject();
      this.loadForm();
    } else {
      this.isLoading = true;
      this.subs.sink = this.roleService
        .getItem(this.id)
        .pipe(
          first(),
          catchError((errorMessage) => {
            this.modal.dismiss(errorMessage);
            return of(this.initObject());
          })
        )
        //.subscribe((roleDto: RoleDto) => {
        .subscribe((roleDto: any) => {
          this.isLoading = false;
          this.roleDto = roleDto.data;
          this.loadForm();
        });
    }
  }

  loadForm() {
    this.formGroup = this.fb.group({
      name: [
        this.roleDto.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      description: [this.roleDto.description],
      isActive: [this.roleDto.isActive],
      permissions: this.permissionList,
      //permissions: [this.roleDto.permissionDto],
      //selectAll: selectAllControl,
    });
  }

  // addPermissionFormControl(){
  //   const formControls = this.permissionList.map(
  //     (control) => new FormControl(false)
  //   );
  // }

  save() {
    this.prepareData();
    if (this.roleDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit() {
    this.subs.sink = this.roleService
      .update(this.id, this.roleInputDto)
      .subscribe(
        (respone: RoleDto) => {
          this.roleDto = respone;
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
    this.subs.sink = this.roleService.create(this.roleInputDto).subscribe(
      (res: RoleDto) => {
        this.roleDto = res;
        Swal.fire('SUCCESS', 'Data saved successfully.', 'success');
        this.modal.close();
      },
      (error) => {
        this.modal.dismiss(error);
        Swal.fire('Failed', 'Role creation failed.', 'error');
        return of(this.initObject());
      }
    );
  }

  prepareData() {
    const loggerUesrId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.roleInputDto.name = formData.name;
    this.roleInputDto.description = formData.description;
    this.roleInputDto.isActive = formData.isActive;
    this.roleInputDto.permissions = this.permissionList;
    if (this.roleDto.id) {
      this.roleInputDto.id = this.roleDto.id;
      this.roleInputDto.createdBy = this.roleDto.createdBy;
      this.roleInputDto.createdAt = this.roleDto.createdAt;
      this.roleInputDto.updatedBy = loggerUesrId;
    } else {
      this.roleInputDto.createdBy = loggerUesrId;
    }
  }

  initObject() {
    const EMPTY_ENTITY: RoleDto = {
      id: 0,
      name: '',
      description: '',
      permissions: [],
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

  onChanges(): void {
    // Subscribe to changes on the selectAll checkbox
    // this.formGroup.get('selectAll').valueChanges.subscribe((bool) => {
    //   this.formGroup
    //     .get('permissions')
    //     .patchValue(Array(this.permissionDto.length).fill(bool), {
    //       emitEvent: false,
    //     });
    // });
    // Subscribe to changes on the music preference checkboxes
    // this.formGroup.get('permissions').valueChanges.subscribe((val) => {
    //   const allSelected = val.every((bool) => bool);
    //   if (this.formGroup.get('selectAll').value !== allSelected) {
    //     this.formGroup
    //       .get('selectAll')
    //       .patchValue(allSelected, { emitEvent: false });
    //   }
    // });
    //   addTag() {
    //     const tagControl = this.newGameForm.get('tagControl');
    //     this.addTagToSelectedList(tagControl.value);
    //     tagControl.setValue('');
    //   }
    // setMax() {
    //   this.sendForm.patchValue({
    //       amount: this.sendForm.get('token').value === this.aService.activeChain['symbol'] ? this.unstaked : this.token_balance
    //   });
    // }
  }

  hasFeatureAccess(id: number) {
    var hasAccess = false;
    _.each(this.roleDto.permissions, (item) => {
      _.each(item.featureModels, (permission) => {
        if (permission.id == id) {
          hasAccess = permission.hasAccess;
        }
      });
    });
    return hasAccess;
  }

  hasActionAccess(id: number, actionId: number) {
    var hasAccess = false;
    _.each(this.roleDto.permissions, (item) => {
      _.each(item.featureModels, (permission) => {
        if (permission.id == id) {
          _.each(permission.actionModels, (action) => {
            if (action.id == actionId) {
              hasAccess = action.hasAccess;
            }
          });
        }
      });
    });
    return hasAccess;
  }

  onCheckAll($event: any) {
    let val = $event.target.checked;
    _.each(this.permissionList, (item) => {
      _.each(item.featureModels, (permission) => {
        permission.hasAccess = val;
        _.each(permission.actionModels, (action) => {
          action.hasAccess = val;
        });
      });
    });

    _.each(this.roleDto.permissions, (item) => {
      _.each(item.featureModels, (permission) => {
        permission.hasAccess = val;
        _.each(permission.actionModels, (action) => {
          action.hasAccess = val;
        });
      });
    });

    const formData = this.formGroup.value;
    var name = formData.name;
    var description = formData.description;
    var isActive = formData.isActive;

    this.formGroup.reset();
    this.formGroup.patchValue({
      name: name,
      description: description,
      isActive: isActive,
    });
  }

  onCheckChange(id: number, $event: any) {
    let val = $event.target.checked;
    _.each(this.permissionList, (item) => {
      _.each(item.featureModels, (permission) => {
        if (permission.id == id) {
          permission.hasAccess = val;
        }
      });
    });
  }

  onActionCheckChange(id: number, actionId: number, $event: any) {
    let val = $event.target.checked;
    _.each(this.permissionList, (item) => {
      _.each(item.featureModels, (permission) => {
        if (permission.id == id) {
          _.each(permission.actionModels, (action) => {
            if (action.id == actionId) {
              action.hasAccess = val;
            }
          });
        }
      });
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