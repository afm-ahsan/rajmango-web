export interface PaymentModel {
  id: number;
  orderId: string;
  paymentMethod: number;
  discount: number;
  recipientAmount: number;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalPayable: number;
  balance: number;
  cashAmount: number;
  changeAmount: number;
  type: number;
  cardType: string;
  walletTransactionId: string;

  isDeleted: boolean;
  createdBy: number | null;
  updatedBy: number | null;
  deletedBy: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
  