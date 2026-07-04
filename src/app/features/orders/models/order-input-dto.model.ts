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
}
