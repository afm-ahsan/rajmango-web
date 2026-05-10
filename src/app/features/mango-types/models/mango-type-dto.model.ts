export interface MangoTypeDto {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  region: string;
  averageWeight: string;
  mangoGrade: number;
  sweetnessLevel: number;
  sequence: number;
  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
