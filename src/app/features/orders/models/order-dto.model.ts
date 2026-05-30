
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { OrderDetailDto } from './order-detail-dto.model';

export interface OrderDto {
  id: number;
  orderNumber: string;
  orderDate?: Date | null;
  totalQuantity: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paidAmount: number;
  dueAmount: number;
  isValidOrder: boolean;
  isDelivered: boolean;
  deliveryDate?: Date | null;
  userId: number;
  trackingNumber?: string;
  courierStationId?: number | null;
  courierStationName?: string | null;
  fallbackAddress?: string;
  area: string;
  receiverType?: number | null;
  receiverName?: string | null;
  receiverMobileNumber?: string | null;
  deliveryStatus: DeliveryStatus;
  orderDetails: OrderDetailDto[];
  // Courier charge breakdown (returned by API)
  productTotalAmount?: number | null;
  courierProviderId?: number | null;
  courierRatePerKg?: number | null;
  courierCharge?: number | null;
  courierChargeOverrideAmount?: number | null;
  isCourierChargeOverridden?: boolean;
  courierChargeNote?: string | null;
  finalCourierCharge?: number | null;
}
