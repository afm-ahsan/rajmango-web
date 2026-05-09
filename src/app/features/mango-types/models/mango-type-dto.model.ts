export interface MangoTypeDto {
  id: number;
  name: string;
  description: string;
  pricePerKg: number;
  imagePath: string;
  isAvailable: boolean;
  sequence: number;
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
