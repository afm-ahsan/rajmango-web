export interface ExpenseDto {
    id: number;
    name: string;
    description: string;
    amount: number;
    expenseTypeId: number;
    isActive: boolean;
    isDeleted: boolean;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
  }
  