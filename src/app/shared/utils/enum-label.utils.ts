import { ComplaintCategory } from "../enums/complaint-category.enum";
import { ComplaintStatus } from "../enums/complaint-status.enum";
import { CrateType } from "../enums/crate-type.enum";
import { CustomerType } from "../enums/customer-type.enum";
import { DeliveryStatus } from "../enums/delivery-status.enum";
import { OrderStatus } from "../enums/order-status.enum";
import { PaymentStatus } from "../enums/payment_status.enum";
import { PolicyType } from "../enums/policy-type.enum";

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
    return DeliveryStatus[type] ?? 'Unknown';
  }

  static getOrderStatusLabel(type: OrderStatus): string {
    return OrderStatus[type] ?? 'Unknown';
  }

  static getPaymentStatusLabel(type: PaymentStatus): string {
    return PaymentStatus[type] ?? 'Unknown';
  }

  static getPaymentMethodLabel(method: number): string {
    const labels: Record<number, string> = {
      0: 'Unknown',
      1: 'Cash',
      2: 'Bank Transfer',
      3: 'Mobile Payment',
      4: 'Credit Card',
      5: 'Debit Card',
      6: 'Visa Card',
      7: 'Master Card',
      8: 'Wallet',
      9: 'bKash',
    };
    return labels[method] ?? `Method ${method}`;
  }

  static getAddressTypeLabel(type: number): string {
    const labels: Record<number, string> = {
      0: 'Unknown',
      1: 'Home',
      2: 'Office',
      3: 'Billing',
      4: 'Shipping',
    };
    return labels[type] ?? `Type ${type}`;
  }

  static getMangoAvailabilityStatusLabel(status: number): string {
    const labels: Record<number, string> = {
      0: 'Upcoming',
      1: 'Available',
      2: 'Sold Out',
      3: 'Closed',
    };
    return labels[status] ?? `Status ${status}`;
  }

  static getComplaintCategoryLabel(category: ComplaintCategory | number): string {
    const labels: Record<number, string> = {
      0: 'Wrong Item',
      1: 'Damaged Item',
      2: 'Late Delivery',
      3: 'Missing Item',
      4: 'Payment Issue',
      5: 'Quality Issue',
      6: 'Other',
    };
    return labels[category as number] ?? 'Unknown';
  }

  static getComplaintStatusLabel(status: ComplaintStatus | number): string {
    const labels: Record<number, string> = {
      0: 'Submitted',
      1: 'Under Review',
      2: 'Resolved',
      3: 'Rejected',
      4: 'Closed',
    };
    return labels[status as number] ?? 'Unknown';
  }

  static getComplaintStatusBadgeClass(status: ComplaintStatus | number): string {
    const classes: Record<number, string> = {
      0: 'badge-light-warning',
      1: 'badge-light-primary',
      2: 'badge-light-success',
      3: 'badge-light-danger',
      4: 'badge-light-secondary',
    };
    return classes[status as number] ?? 'badge-light-secondary';
  }

  static getPolicyTypeLabel(type: PolicyType | number): string {
    const labels: Record<number, string> = {
      0: 'Order Policy',
      1: 'Payment Policy',
      2: 'Refund Policy',
      3: 'Delivery Policy',
      4: 'Complaint Policy',
      5: 'Privacy Policy',
    };
    return labels[type as number] ?? 'Policy';
  }

  static getMangoGradeLabel(grade: number): string {
    const labels: Record<number, string> = {
      0: '—',
      1: 'Premium',
      2: 'Standard',
      3: 'Economy',
      4: 'Export Quality',
      5: 'Organic',
    };
    return labels[grade] ?? 'Unknown';
  }

  static getSweetnessLevelLabel(level: number): string {
    const labels: Record<number, string> = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Very High',
    };
    return labels[level] ?? '—';
  }

  static getMangoGradeBadgeClass(grade: number): string {
    const classes: Record<number, string> = {
      0: 'badge-light-secondary',
      1: 'badge-light-info',
      2: 'badge-light-primary',
      3: 'badge-light-warning',
      4: 'badge-light-success',
      5: 'badge-light-danger',
    };
    return classes[grade] ?? 'badge-light-secondary';
  }

  static getSweetnessLevelBadgeClass(level: number): string {
    const classes: Record<number, string> = {
      1: 'badge-light-secondary',
      2: 'badge-light-info',
      3: 'badge-light-warning',
      4: 'badge-light-success',
    };
    return classes[level] ?? 'badge-light-secondary';
  }

  static getMangoAvailabilityStatusBadgeClass(status: number): string {
    const classes: Record<number, string> = {
      0: 'badge-light-dark',
      1: 'badge-light-success',
      2: 'badge-light-warning',
      3: 'badge-light-danger',
    };
    return classes[status] ?? 'badge-light-dark';
  }
}
