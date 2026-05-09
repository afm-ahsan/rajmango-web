
export interface OrderDetailModel {
  orderId: string;
  itemId: number;
  itemName: string;
  imagePath: string;
  quantity: number;
  servedQty: number;
  price: number;
  totalPrice: number;
  netAmount: number;
  isReady: boolean;
}