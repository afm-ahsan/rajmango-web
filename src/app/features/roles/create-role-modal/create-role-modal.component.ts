import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, first, of } from 'rxjs';
import { FeatureModel, PermissionModel } from 'src/app/shared/models/permission.model';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
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
    this.loadPermissions();
    this.loadEntity();
    this.loadForm();
  }

  // ─── Data loading ─────────────────────────────────────────────────

  loadPermissions(): void {
    this.permissionList = this.permissionService.getPermissionList();
  }

  loadEntity(): void {
    if (!this.id) {
      this.roleDto = this.initObject();
      this.loadForm();
      return;
    }
    this.isLoading = true;
    this.subs.sink = this.roleService
      .getItem(this.id)
      .pipe(
        first(),
        catchError((err) => {
          this.modal.dismiss(err);
          return of({ data: this.initObject() });
        })
      )
      .subscribe((res: any) => {
        this.isLoading = false;
        this.roleDto = res.data;
        this.applyExistingPermissions();
        this.loadForm();
      });
  }

  loadForm(): void {
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
      isActive: [this.roleDto.isActive ?? true],
    });
  }

  // Overlay saved role permissions (flat string[]) onto the checkbox tree
  private applyExistingPermissions(): void {
    const savedPerms = new Set<string>(this.roleDto.permissions ?? []);
    if (!savedPerms.size) return;
    for (const group of this.permissionList) {
      for (const feature of group.featureModels) {
        for (const action of feature.actionModels) {
          const perm = this.permissionService.getPermissionString(feature.id, action.id);
          action.hasAccess = !!perm && savedPerms.has(perm);
        }
        feature.hasAccess = feature.actionModels.some(a => a.hasAccess);
      }
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────

  save(): void {
    this.prepareData();
    if (this.roleDto.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  edit(): void {
    this.subs.sink = this.roleService.update(this.id, this.roleInputDto).subscribe(
      (res: any) => {
        Swal.fire('Updated', 'Role updated successfully.', 'success');
        this.modal.close();
      },
      (err) => {
        Swal.fire('Failed', 'Role update failed.', 'error');
        this.modal.dismiss(err);
      }
    );
  }

  create(): void {
    this.subs.sink = this.roleService.create(this.roleInputDto).subscribe(
      (res: any) => {
        Swal.fire('Created', 'Role created successfully.', 'success');
        this.modal.close();
      },
      (err) => {
        Swal.fire('Failed', 'Role creation failed.', 'error');
        this.modal.dismiss(err);
      }
    );
  }

  prepareData(): void {
    const loggedUserId = this.authService.getLoggedUserId();
    const formData = this.formGroup.value;
    this.roleInputDto.name = formData.name;
    this.roleInputDto.description = formData.description;
    this.roleInputDto.isActive = formData.isActive;

    const selectedPerms = new Set<string>();
    for (const group of this.permissionList) {
      for (const feature of group.featureModels) {
        for (const action of feature.actionModels) {
          if (action.hasAccess) {
            const perm = this.permissionService.getPermissionString(feature.id, action.id);
            if (perm) selectedPerms.add(perm);
          }
        }
      }
    }
    this.roleInputDto.permissions = Array.from(selectedPerms);

    if (this.roleDto.id) {
      this.roleInputDto.id = this.roleDto.id;
      this.roleInputDto.createdBy = this.roleDto.createdBy;
      this.roleInputDto.createdAt = this.roleDto.createdAt;
      this.roleInputDto.updatedBy = loggedUserId;
    } else {
      this.roleInputDto.createdBy = loggedUserId;
    }
  }

  initObject(): RoleDto {
    return {
      id: 0,
      name: '',
      description: '',
      permissions: [],
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

  // ─── Select-All (global) ──────────────────────────────────────────

  get isAllChecked(): boolean {
    return this.permissionList.every((g) =>
      g.featureModels.every((f) => f.hasAccess && f.actionModels.every((a) => a.hasAccess))
    );
  }

  get isAllIndeterminate(): boolean {
    const anyOn = this.permissionList.some((g) =>
      g.featureModels.some((f) => f.hasAccess || f.actionModels.some((a) => a.hasAccess))
    );
    return anyOn && !this.isAllChecked;
  }

  onCheckAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const group of this.permissionList) {
      for (const feature of group.featureModels) {
        feature.hasAccess = checked;
        for (const action of feature.actionModels) {
          action.hasAccess = checked;
        }
      }
    }
  }

  // ─── Group-level select ───────────────────────────────────────────

  isGroupAllChecked(group: PermissionModel): boolean {
    return group.featureModels.every(
      (f) => f.hasAccess && f.actionModels.every((a) => a.hasAccess)
    );
  }

  isGroupIndeterminate(group: PermissionModel): boolean {
    const anyOn = group.featureModels.some(
      (f) => f.hasAccess || f.actionModels.some((a) => a.hasAccess)
    );
    return anyOn && !this.isGroupAllChecked(group);
  }

  onGroupCheckAll(group: PermissionModel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    for (const feature of group.featureModels) {
      feature.hasAccess = checked;
      for (const action of feature.actionModels) {
        action.hasAccess = checked;
      }
    }
  }

  // ─── Feature-level select (auto-toggles actions) ──────────────────

  isFeatureIndeterminate(feature: FeatureModel): boolean {
    if (!feature.actionModels.length) return false;
    const anyOn = feature.actionModels.some((a) => a.hasAccess);
    return anyOn && !feature.actionModels.every((a) => a.hasAccess);
  }

  onFeatureChange(feature: FeatureModel, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    feature.hasAccess = checked;
    for (const action of feature.actionModels) {
      action.hasAccess = checked;
    }
  }

  // ─── Action-level select (auto-updates parent) ────────────────────

  onActionChange(feature: FeatureModel, actionId: number, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const action = feature.actionModels.find((a) => a.id === actionId);
    if (action) action.hasAccess = checked;
    // parent feature = true when at least one action is on
    feature.hasAccess = feature.actionModels.some((a) => a.hasAccess);
  }

  // ─── Form helpers ─────────────────────────────────────────────────

  isControlValid(controlName: string): boolean {
    const c = this.formGroup.controls[controlName];
    return c.valid && (c.dirty || c.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const c = this.formGroup.controls[controlName];
    return c.invalid && (c.dirty || c.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const c = this.formGroup.controls[controlName];
    return c.hasError(validation) && (c.dirty || c.touched);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
