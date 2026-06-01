export enum NotificationType {
  OrderStatus   = 1,
  PaymentStatus = 2,
  DeliveryStatus = 3,
  DeliveryDate  = 4,
}

export interface NotificationDto {
  id: number;
  orderId?: number | null;
  orderNumber?: string | null;
  title: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}
