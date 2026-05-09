export interface UserDto {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  email: string;
  emailConfirmed: boolean;
  password: string;
  passwordHash: string;
  accessFailedCount: number;
  isActive: boolean;
  roleId: number;
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
  