import { FeatureDto } from "./feature-dto.model";

export interface PermissionDto {
  groupId: number;
  groupName: string;
  features: FeatureDto[];
}
  