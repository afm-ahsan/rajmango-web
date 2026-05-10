export interface FeedbackDto {
  id: number;
  orderId: number;
  orderNumber: string;
  userId: number;
  customerName: string;
  rating: number;
  note: string;
  createdAt: string;
}

export interface SubmitFeedbackRequest {
  orderId: number;
  rating: number;
  note: string;
}
