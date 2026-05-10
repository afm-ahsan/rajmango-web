import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SubSink } from 'subsink';
import { PolicyType } from 'src/app/shared/enums/policy-type.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { PolicyService } from '../policy.service';
import { PolicyDto } from '../models/policy.model';

@Component({
  selector: 'app-admin-policy-list',
  templateUrl: './admin-policy-list.component.html',
})
export class AdminPolicyListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  isSaving = false;
  policies: PolicyDto[] = [];
  editingPolicy: PolicyDto | null = null;
  form!: FormGroup;

  policyTypeOptions = [
    { value: PolicyType.Order, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Order) },
    { value: PolicyType.Payment, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Payment) },
    { value: PolicyType.Refund, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Refund) },
    { value: PolicyType.Delivery, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Delivery) },
    { value: PolicyType.Complaint, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Complaint) },
    { value: PolicyType.Privacy, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Privacy) },
  ];

  constructor(
    private policyService: PolicyService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.load();
  }

  buildForm(policy?: PolicyDto): void {
    this.form = this.fb.group({
      policyType: [policy?.policyType ?? PolicyType.Order, Validators.required],
      title: [policy?.title ?? '', [Validators.required, Validators.maxLength(200)]],
      content: [policy?.content ?? '', Validators.required],
      isActive: [policy?.isActive ?? true],
    });
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.policyService.getAll().subscribe({
      next: (res: any) => {
        this.policies = res?.data ?? [];
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  edit(policy: PolicyDto): void {
    this.editingPolicy = policy;
    this.buildForm(policy);
    this.cdRef.detectChanges();
  }

  cancelEdit(): void {
    this.editingPolicy = null;
    this.buildForm();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.policyService.upsert({
      policyType: +this.form.value.policyType,
      title: this.form.value.title,
      content: this.form.value.content,
      isActive: this.form.value.isActive,
    }).subscribe({
      next: (res: any) => {
        this.isSaving = false;
        if (res?.succeeded) {
          Swal.fire({ icon: 'success', title: 'Saved', timer: 1500, showConfirmButton: false });
          this.editingPolicy = null;
          this.buildForm();
          this.load();
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res?.messages?.[0] ?? 'Could not save policy.' });
        }
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isSaving = false;
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong.' });
        this.cdRef.detectChanges();
      },
    });
  }

  getPolicyTypeLabel(type: any): string { return EnumLabelUtils.getPolicyTypeLabel(type); }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
