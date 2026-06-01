import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { OrderService } from '../orders/order.service';

interface TimelineItem {
  trackingStatus: string;
  title: string;
  description: string;
  createdAt: string;
}

interface TrackingResult {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  receiverName: string;
  deliveryArea: string;
  courierProviderName: string;
  courierStationName: string;
  totalQuantity: number;
  totalAmount: number;
  orderStatus: number;
  paymentStatus: number;
  deliveryStatus: number;
  deliveryDate: string | null;
  timeline: TimelineItem[];
}

interface TimelineStep {
  keys: string[];
  label: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss'],
})
export class TrackOrderComponent implements OnInit {
  orderNumber = '';
  phoneNumber = '';
  isLoading = false;
  errorMessage = '';
  result: TrackingResult | null = null;
  scrollProgress = 0;
  readonly currentYear = new Date().getFullYear();

  @HostListener('window:scroll')
  onScroll(): void {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = total > 0 ? (window.scrollY / total) * 100 : 0;
  }

  readonly timelineSteps: TimelineStep[] = [
    { keys: ['OrderPlaced'],                         label: 'Order Placed',        icon: 'bi-bag-check',           colorClass: 'step-primary'  },
    { keys: ['OrderConfirmed'],                      label: 'Order Confirmed',     icon: 'bi-check-circle',        colorClass: 'step-info'     },
    { keys: ['PaymentPaid', 'PaymentPartial'],       label: 'Payment Completed',   icon: 'bi-credit-card-2-front', colorClass: 'step-success'  },
    { keys: ['OrderProcessing'],                     label: 'Ready for Courier',   icon: 'bi-box-seam',            colorClass: 'step-warning'  },
    { keys: ['OrderShipped', 'DeliveryDispatched'],  label: 'Dispatched',          icon: 'bi-truck',               colorClass: 'step-primary'  },
    { keys: ['DeliveryInTransit'],                   label: 'In Transit',          icon: 'bi-signpost-split',      colorClass: 'step-warning'  },
    { keys: ['OrderDelivered', 'DeliveryDelivered'], label: 'Delivered',           icon: 'bi-house-check',         colorClass: 'step-success'  },
  ];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((p) => {
      if (p['orderNumber']) this.orderNumber = p['orderNumber'];
    });
  }

  track(): void {
    if (!this.orderNumber.trim() || !this.phoneNumber.trim()) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;

    this.orderService
      .trackOrder({ orderNumber: this.orderNumber.trim(), phoneNumber: this.phoneNumber.trim() })
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res?.succeeded && res?.data) {
            this.result = res.data as TrackingResult;
          } else {
            this.errorMessage = res?.messages?.[0] ?? 'Order not found or phone number does not match.';
          }
          this.cdRef.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Something went wrong. Please try again.';
          this.cdRef.markForCheck();
        },
      });
  }

  reset(): void {
    this.result = null;
    this.errorMessage = '';
  }

  isStepCompleted(step: TimelineStep): boolean {
    if (!this.result) return false;
    const statuses = new Set(this.result.timeline.map((t) => t.trackingStatus));
    return step.keys.some((k) => statuses.has(k));
  }

  getStepTimestamp(step: TimelineStep): string | null {
    if (!this.result) return null;
    for (const key of step.keys) {
      const entry = this.result.timeline.find((t) => t.trackingStatus === key);
      if (entry) return entry.createdAt;
    }
    return null;
  }

  getOrderStatusLabel(s: number): string  { return EnumLabelUtils.getOrderStatusLabel(s as OrderStatus); }
  getOrderStatusBadgeClass(s: number): string { return EnumLabelUtils.getOrderStatusBadgeClass(s as OrderStatus); }
  getPaymentStatusLabel(s: number): string { return EnumLabelUtils.getPaymentStatusLabel(s as PaymentStatus); }
  getPaymentStatusBadgeClass(s: number): string { return EnumLabelUtils.getPaymentStatusBadgeClass(s as PaymentStatus); }
  getDeliveryStatusLabel(s: number): string { return EnumLabelUtils.getDeliveryStatusLabel(s as DeliveryStatus); }
  getDeliveryStatusBadgeClass(s: number): string { return EnumLabelUtils.getDeliveryStatusBadgeClass(s as DeliveryStatus); }
}
