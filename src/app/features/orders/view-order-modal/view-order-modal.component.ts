import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { ReceiverType } from 'src/app/shared/enums/receiver-type.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { SubSink } from 'subsink';
import { OrderDto } from '../models/order-dto.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-view-order-modal',
  templateUrl: './view-order-modal.component.html',
  styleUrls: ['./view-order-modal.component.scss']
})
export class ViewOrderModalComponent implements OnInit, OnDestroy {
  @Input() id!: number;
  @Input() orders: OrderDto[] = [];

  orderDto: OrderDto = {} as OrderDto;
  isLoading = false;
  readonly ReceiverType = ReceiverType;
  private subs = new SubSink();

  constructor(
    public modal: NgbActiveModal,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private loadOrder(): void {
    this.isLoading = true;
    this.subs.sink = this.orderService.getById(this.id).subscribe({
      next: (response) => {
        this.orderDto = response.data;
        this.enrichOrderDetails();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private enrichOrderDetails(): void {
    if (!this.orderDto.orderDetails) return;
    this.orderDto.orderDetails = this.orderDto.orderDetails.map(detail => ({
      ...detail,
      mangoName: detail.mangoName ?? 'Unknown',
      crateName: EnumLabelUtils.getCrateTypeLabel(detail.crateType)
    }));
  }

  getOrderStatusLabel(status: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getOrderStatusBadgeClass(status: OrderStatus): string {
    const classes: Record<number, string> = {
      [OrderStatus.None]: 'badge-light-secondary',
      [OrderStatus.Pending]: 'badge-light-warning',
      [OrderStatus.Confirmed]: 'badge-light-info',
      [OrderStatus.Processing]: 'badge-light-primary',
      [OrderStatus.Shipped]: 'badge-light-primary',
      [OrderStatus.Delivered]: 'badge-light-success',
      [OrderStatus.Cancelled]: 'badge-light-danger',
      [OrderStatus.Returned]: 'badge-light-warning',
      [OrderStatus.Failed]: 'badge-light-danger',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    const classes: Record<number, string> = {
      [PaymentStatus.None]: 'badge-light-secondary',
      [PaymentStatus.Unpaid]: 'badge-light-danger',
      [PaymentStatus.Paid]: 'badge-light-success',
      [PaymentStatus.Partial]: 'badge-light-warning',
      [PaymentStatus.Failed]: 'badge-light-danger',
      [PaymentStatus.Refunded]: 'badge-light-info',
      [PaymentStatus.Cancelled]: 'badge-light-secondary',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  getDeliveryStatusLabel(status: DeliveryStatus): string {
    return EnumLabelUtils.getDeliveryStatusLabel(status);
  }

  getDeliveryStatusBadgeClass(status: DeliveryStatus): string {
    const classes: Record<number, string> = {
      [DeliveryStatus.None]: 'badge-light-secondary',
      [DeliveryStatus.Pending]: 'badge-light-warning',
      [DeliveryStatus.Dispatched]: 'badge-light-info',
      [DeliveryStatus.InTransit]: 'badge-light-primary',
      [DeliveryStatus.Delivered]: 'badge-light-success',
      [DeliveryStatus.Failed]: 'badge-light-danger',
      [DeliveryStatus.Returned]: 'badge-light-warning',
      [DeliveryStatus.Cancelled]: 'badge-light-secondary',
    };
    return classes[status] ?? 'badge-light-secondary';
  }
}
