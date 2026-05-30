import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';

export interface AdminOrderListDto {
  orderId: number;
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerPhone: string;
  totalQuantity: number;
  productTotal: number;
  courierCharge: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  courierStationName: string;
  courierProviderName: string;
  mangoTypeName: string;
}

export interface AdminOrderFilterModel {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortOrder: string;
  orderNumber?: string;
  customerName?: string;
  phoneNumber?: string;
  orderStatus?: number | null;
  paymentStatus?: number | null;
  deliveryStatus?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  courierProviderId?: number | null;
  courierStationId?: number | null;
  mangoType?: string;
}
