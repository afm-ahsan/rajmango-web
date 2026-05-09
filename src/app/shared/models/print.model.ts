import { OrderDetailModel } from "./order-detail.model";

export interface PrintModel {
  orderId: string;
  orderDetails: OrderDetailModel[];
  paymentMethodType: number;
  paymentMethod: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalPayable: number;
  cashAmount: number;
  changeAmount: number;
  cardType: string;
  walletTransactionId: string;
  date: string;
  time: string;
}
  