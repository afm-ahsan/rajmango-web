import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';

export interface OrderPaymentLookupDto {
  /** Internal Order PK — used in CreatePaymentCommand, never displayed. */
  orderId: number;
  orderNumber: string;
  customerName: string;
  receiverName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
}
