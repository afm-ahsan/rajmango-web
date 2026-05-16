import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, first, of } from 'rxjs';
import { FeatureModel, PermissionModel } from 'src/app/shared/models/permission.model';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { RoleDto } from '../models/role-dto.model';
import { RoleService } from '../role.service';

export type RoleModalMode = 'create' | 'edit' | 'view';

/** Minimal payload sent to POST /api/role — audit fields are set server-side. */
interface RoleCreatePayload {
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
}

/** Minimal payload sent to PUT /api/role/{id} */
interface RoleUpdatePayload extends RoleCreatePayload {
  id: number;
}

@Component({
  selector: 'app-create-role-modal',
  templateUrl: './create-role-modal.component.html',
  styleUrls: ['./create-role-modal.component.scss'],
})
export class CreateRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: number = 0;
  @Input() mode: RoleModalMode = 'create';

  permissionList: PermissionModel[] = [];
  roleDto: RoleDto = {} as RoleDto;
  formGroup: FormGroup;
  subs = new SubSink();

  /** True while fetching role details (edit/view initial load) → shows body spinner. */
  isLoading = false;
  /** True while submitting create/update → shows button spinner. Never true together with isLoading. */
  isSaving = false;

  get isViewMode(): boolean { return this.mode === 'view'; }

  get modalTitle(): string {
    if (this.mode === 'view') return 'Role Details';
    if (this.mode === 'edit') return 'Edit Role';
    return 'Add Role';
  }

  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    private roleService: RoleService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadPermissions();
    this.loadEntity();
    // loadForm() is called inside both branches of loadEntity() — NOT called here.
  }

  // ─── Data loading ─────────────────────────────────────────────────

  loadPermissions(): void {
    this.permissionList = this.permissionService.getPermissionList();
  }

  loadEntity(): void {
    if (!this.id) {
      this.mode = 'create';
      this.roleDto = this.emptyRole();
      this.loadForm();
      return;
    }

    if (this.mode === 'create') {
      this.mode = 'edit';
    }

    this.isLoading = true;
    this.subs.sink = this.roleService
      .getItem(this.id)
      .pipe(
        first(),
        catchError((err) => {
          console.error('Failed to load role:', err);
          this.modal.dismiss(err);
          return of({ data: this.emptyRole() });
        }),
        finalize(() => { this.isLoading = false; })
      )
      .subscribe((res: any) => {
        this.roleDto = res.data ?? this.emptyRole();
        this.applyExistingPermissions();
        this.loadForm();
      });
  }

  loadForm(): void {
    this.formGroup = this.fb.group({
      name: [this.roleDto.name, Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])],
      description: [this.roleDto.description],
      isActive: [this.roleDto.isActive ?? true],
    });
    if (this.isViewMode) {
      this.formGroup.disable();
    }
  }

  private applyExistingPermissions(): void {
    const saved = new Set<string>(this.roleDto.permissions ?? []);
    for (const group of this.permissionList) {
      for (const feature of group.featureModels) {
        for (const action of feature.actionModels) {
          const key = this.permissionService.getPermissionString(feature.id, action.id);
          action.hasAccess = !!key && saved.has(key);
        }
        feature.hasAccess = feature.actionModels.some(a => a.hasAccess);
      }
    }
  }

  // ─── Save ─────────────────────────────────────────────────────────

  save(): void {
    if (this.isViewMode || this.formGroup.invalid || this.isSaving || this.isLoading) return;

    const { name, description, isActive } = this.formGroup.value;
    const permissions = this.collectSelectedPermissions();

    if (this.roleDto.id) {
      const payload: RoleUpdatePayload = { id: this.roleDto.id, name, description, isActive, permissions };
      this.submitUpdate(payload);
    } else {
      const payload: RoleCreatePayload = { name, description, isActive, permissions };
      this.submitCreate(payload);
    }
  }

  private submitUpdate(payload: RoleUpdatePayload): void {
    this.isSaving = true;
    this.subs.sink = this.roleService
      .update(payload.id, payload)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          Swal.fire({ title: 'Updated', text: 'Role updated successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
          this.modal.close();
        },
        error: (err) => {
          console.error('Role update error:', err);
          Swal.fire('Failed', 'Role update failed. Please try again.', 'error');
        },
      });
  }

  private submitCreate(payload: RoleCreatePayload): void {
    this.isSaving = true;
    this.subs.sink = this.roleService
      .create(payload)
      .pipe(finalize(() => { this.isSaving = false; }))
      .subscribe({
        next: () => {
          Swal.fire({ title: 'Created', text: 'Role created successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
          this.modal.close();
        },
        error: (err) => {
          console.error('Role create error:', err);
          Swal.fire('Failed', 'Role creation failed. Please try again.', 'error');
        },
      });
  }

  private collectSelectedPermissions(): string[] {
    const selected = new Set<string>();
    for (const group of this.permissionList) {
      for (const feature of group.featureModels) {
        for (const action of feature.actionModels) {
          if (action.hasAccess) {
            const key = this.permissionService.getPermissionString(feature.id, action.id);
            if (key) selected.add(key);
          }
        }
      }
    }
    return Array.from(selected);
  }

  private emptyRole(): RoleDto {
    return { id: 0, name: '', description: '', permissions: [], isActive: true,
             isDeleted: false, createdBy: null, updatedBy: null, deletedBy: null,
             createdAt: null, updatedAt: null, deletedAt: null };
  }

  // ─── Select-All (global) ──────────────────────────────────────────

  get isAllChecked(): boolean {
    return this.permissionList.every(g => g.featureModels.every(f => f.hasAccess && f.actionModels.every(a => a.hasAccess)));
  }

  get isAllIndeterminate(): boolean {
    const anyOn = this.permissionList.some(g => g.featureModels.some(f => f.hasAccess || f.actionModels.some(a => a.hasAccess)));
    return anyOn && !this.isAllChecked;
  }

  onCheckAll(event: Event): void {
    if (this.isViewMode) return;
    const checked = (event.target as HTMLInputElement).checked;
    for (const group of this.permissionList)
      for (const feature of group.featureModels) {
        feature.hasAccess = checked;
        for (const action of feature.actionModels) action.hasAccess = checked;
      }
  }

  // ─── Group-level select ───────────────────────────────────────────

  isGroupAllChecked(group: PermissionModel): boolean {
    return group.featureModels.every(f => f.hasAccess && f.actionModels.every(a => a.hasAccess));
  }

  isGroupIndeterminate(group: PermissionModel): boolean {
    const anyOn = group.featureModels.some(f => f.hasAccess || f.actionModels.some(a => a.hasAccess));
    return anyOn && !this.isGroupAllChecked(group);
  }

  onGroupCheckAll(group: PermissionModel, event: Event): void {
    if (this.isViewMode) return;
    const checked = (event.target as HTMLInputElement).checked;
    for (const feature of group.featureModels) {
      feature.hasAccess = checked;
      for (const action of feature.actionModels) action.hasAccess = checked;
    }
  }

  // ─── Feature-level select ─────────────────────────────────────────

  isFeatureIndeterminate(feature: FeatureModel): boolean {
    if (!feature.actionModels.length) return false;
    const anyOn = feature.actionModels.some(a => a.hasAccess);
    return anyOn && !feature.actionModels.every(a => a.hasAccess);
  }

  onFeatureChange(feature: FeatureModel, event: Event): void {
    if (this.isViewMode) return;
    const checked = (event.target as HTMLInputElement).checked;
    feature.hasAccess = checked;
    for (const action of feature.actionModels) action.hasAccess = checked;
  }

  // ─── Action-level select ──────────────────────────────────────────

  onActionChange(feature: FeatureModel, actionId: number, event: Event): void {
    if (this.isViewMode) return;
    const checked = (event.target as HTMLInputElement).checked;
    const action = feature.actionModels.find(a => a.id === actionId);
    if (action) action.hasAccess = checked;
    feature.hasAccess = feature.actionModels.some(a => a.hasAccess);
  }

  // ─── Form helpers ─────────────────────────────────────────────────

  isControlValid(controlName: string): boolean {
    const c = this.formGroup?.controls[controlName];
    return !!c && c.valid && (c.dirty || c.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const c = this.formGroup?.controls[controlName];
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  controlHasError(validation: string, controlName: string): boolean {
    const c = this.formGroup?.controls[controlName];
    return !!c && c.hasError(validation) && (c.dirty || c.touched);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
