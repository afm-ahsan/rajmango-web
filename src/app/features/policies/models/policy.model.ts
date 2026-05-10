import { PolicyType } from 'src/app/shared/enums/policy-type.enum';

export interface PolicyDto {
  id: number;
  policyType: PolicyType;
  title: string;
  content: string;
  isActive: boolean;
  updatedAt?: string | null;
}

export interface UpsertPolicyRequest {
  policyType: PolicyType;
  title: string;
  content: string;
  isActive: boolean;
}
