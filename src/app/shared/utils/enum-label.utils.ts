import { CrateType } from "../enums/crate-type.enum";
import { CustomerType } from "../enums/customer-type.enum";
import { DeliveryStatus } from "../enums/delivery-status.enum";
import { MangoType } from "../enums/mango-type.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment_status.enum";

export class EnumLabelUtils {
  static getCrateTypeLabel(type: CrateType): string {
    switch (type) {
      case CrateType.Crate10Kg: return '10Kg';
      case CrateType.Crate20Kg: return '20Kg';
      default: return 'Unknown';
    }
  }

  static getCustomerTypeLabel(type: CustomerType): string {
    return CustomerType[type] ?? 'Unknown';
  }

  static getDeliveryStatusLabel(type: DeliveryStatus): string {
    return OrderStatus[type] ?? 'Unknown';
  }

  static getOrderStatusLabel(type: OrderStatus): string {
    return OrderStatus[type] ?? 'Unknown';
  }

  static getPaymentStatusLabel(type: PaymentStatus): string {
    return PaymentStatus[type] ?? 'Unknown';
  }

  static getMangoTypeLabel(mangoTypeId: number): string {
    return MangoType[mangoTypeId] ?? 'Unknown';
  }
  // Add more enums as needed
}
