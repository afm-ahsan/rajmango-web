import { PermissionModel } from "src/app/shared/models/permission.model";

export interface RoleDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: PermissionModel[];
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
  