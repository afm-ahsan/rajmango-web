export interface CustomerDto {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  customerType: number;
  isActive: boolean;
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
  