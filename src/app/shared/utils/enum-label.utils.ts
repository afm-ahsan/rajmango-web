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

  static getPaymentMethodLabel(method: number): string {
    const labels: Record<number, string> = {
      0: 'None',
      1: 'Cash',
      2: 'bKash',
      3: 'Nagad',
      4: 'Rocket',
      5: 'Bank Transfer',
      6: 'Cheque',
      7: 'Card',
      8: 'Other',
    };
    return labels[method] ?? `Method ${method}`;
  }

  static getAddressTypeLabel(type: number): string {
    const labels: Record<number, string> = {
      0: 'Unknown',
      1: 'Home',
      2: 'Work',
      3: 'Billing',
      4: 'Shipping',
    };
    return labels[type] ?? `Type ${type}`;
  }

  static getMangoAvailabilityStatusLabel(status: number): string {
    const labels: Record<number, string> = {
      0: 'Upcoming',
      1: 'Available',
      2: 'Limited',
      3: 'Ended',
    };
    return labels[status] ?? `Status ${status}`;
  }
}
