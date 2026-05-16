export interface RoleInputDto {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  permissions: string[];
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
