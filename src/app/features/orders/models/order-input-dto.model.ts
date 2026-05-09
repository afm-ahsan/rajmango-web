import { OrderDetailInputDto } from './order-detail-input-dto.model';

export interface OrderInputDto {
  id: number;
  userId: number;
  courierStationId: number | null;
  fallbackAddress: string | null;
  orderDetails: OrderDetailInputDto[];
}
