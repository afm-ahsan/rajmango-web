import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';

export interface AdminOrderListDto {
  orderId: number;
  orderNumber: string;
  orderDate: string;

  customerName: string;
  customerPhone: string;

  receiverType: number;    // 0 = Self, 1 = Others
  receiverName: string;    // resolved: customer name or order receiver name
  receiverMobile: string;  // resolved: customer phone or order receiver mobile

  courierProviderName: string;
  courierStationName: string;
  courierStationAddress: string;
  deliveryArea: string;

  totalQuantity: number;
  productTotal: number;
  courierCharge: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  deliveryDate: string | null;

  isCourierEligible: boolean;
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
  courierEligibleOnly?: boolean;
  deliveryArea?: string;
  receiverMobile?: string;
}
