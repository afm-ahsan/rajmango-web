export interface UserInputDto {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  imagePath?: string;
  isActive: boolean;
  roleId: number;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
