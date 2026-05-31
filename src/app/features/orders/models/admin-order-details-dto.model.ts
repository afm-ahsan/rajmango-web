import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';

export interface AdminOrderDetailsDto {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  totalQuantity: number;

  customerId: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;

  productTotal: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  finalCourierCharge: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;

  trackingNumber: string;
  deliveryDate: string;
  fallbackAddress: string;
  receiverType: number;
  receiverName: string;
  receiverMobileNumber: string;
  deliveryNote: string;

  courierProviderId: number;
  courierProviderName: string;
  courierStationId: number;
  courierStationName: string;
  courierStationAddress: string;
  deliveryArea: string;
  courierLocationType: number;

  isCourierEligible: boolean;

  courierRatePerKg: number;
  courierChargeCalculated: number;
  courierChargeOverrideAmount: number;
  isCourierChargeOverridden: boolean;
  courierChargeNote: string;

  orderItems: AdminOrderItemDto[];
  payments: AdminOrderPaymentDto[];

  createdAt: string;
  updatedAt: string;
}

export interface AdminOrderItemDto {
  id: number;
  mangoTypeId: number;
  mangoTypeName: string;
  crateType: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  note: string;
}

export interface AdminOrderPaymentDto {
  id: number;
  paidAmount: number;
  netAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: number;
  transactionId: string;
  paidAt: string;
  createdAt: string;
}
