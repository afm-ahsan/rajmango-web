import { ComplaintCategory } from 'src/app/shared/enums/complaint-category.enum';
import { ComplaintStatus } from 'src/app/shared/enums/complaint-status.enum';

export interface ComplaintDto {
  id: number;
  orderId: number;
  orderNumber: string;
  userId: number;
  customerName: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  adminNote: string;
  resolvedBy?: number | null;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface SubmitComplaintRequest {
  orderId: number;
  category: ComplaintCategory;
  description: string;
}

export interface UpdateComplaintStatusRequest {
  id: number;
  status: ComplaintStatus;
  adminNote: string;
}
