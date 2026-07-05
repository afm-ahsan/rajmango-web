import { OrderDetailInputDto } from './order-detail-input-dto.model';

export interface OrderInputDto {
  id: number;
  userId: number;
  courierStationId: number | null;
  fallbackAddress: string | null;
  orderDetails: OrderDetailInputDto[];
  receiverType: number | null;
  receiverName: string | null;
  receiverMobileNumber: string | null;
  /** Maps to Order.DeliveryNote — overall customer delivery instruction. */
  deliveryNote?: string | null;
  /**
   * Admin-only: when supplied, overrides the courier charge and marks the order as
   * courier-charge-overridden. Null = use existing logic (preserve current override or recalculate).
   */
  explicitCourierCharge?: number | null;
}
