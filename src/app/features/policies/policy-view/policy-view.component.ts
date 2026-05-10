import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SubSink } from 'subsink';
import { PolicyType } from 'src/app/shared/enums/policy-type.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { PolicyService } from '../policy.service';
import { PolicyDto } from '../models/policy.model';

@Component({
  selector: 'app-policy-view',
  templateUrl: './policy-view.component.html',
})
export class PolicyViewComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  policies: PolicyDto[] = [];
  activeTab: PolicyType = PolicyType.Order;

  PolicyType = PolicyType;

  tabOptions = [
    { type: PolicyType.Order, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Order) },
    { type: PolicyType.Payment, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Payment) },
    { type: PolicyType.Refund, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Refund) },
    { type: PolicyType.Delivery, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Delivery) },
    { type: PolicyType.Complaint, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Complaint) },
    { type: PolicyType.Privacy, label: EnumLabelUtils.getPolicyTypeLabel(PolicyType.Privacy) },
  ];

  constructor(private policyService: PolicyService, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.policyService.getAll().subscribe({
      next: (res: any) => {
        this.policies = res?.data ?? [];
        if (this.policies.length) this.activeTab = this.policies[0].policyType;
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdRef.detectChanges();
      },
    });
  }

  activePolicy(): PolicyDto | undefined {
    return this.policies.find(p => p.policyType === this.activeTab);
  }

  policyExists(type: PolicyType): boolean {
    return this.policies.some(p => p.policyType === type);
  }

  setTab(type: PolicyType): void {
    this.activeTab = type;
  }

  ngOnDestroy(): void { this.subs.unsubscribe(); }
}
