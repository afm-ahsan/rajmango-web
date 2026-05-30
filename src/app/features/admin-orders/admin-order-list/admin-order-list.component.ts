import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { SubSink } from 'subsink';
import { OrderService } from '../../orders/order.service';
import { AdminOrderFilterModel, AdminOrderListDto } from '../../orders/models/admin-order-list-dto.model';
import { AdminOrderViewModalComponent } from '../admin-order-view-modal/admin-order-view-modal.component';
import { AdminOrderActionModalComponent } from '../admin-order-action-modal/admin-order-action-modal.component';

@Component({
  selector: 'app-admin-order-list',
  templateUrl: './admin-order-list.component.html',
})
export class AdminOrderListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  orders: AdminOrderListDto[] = [];
  totalCount = 0;

  readonly OrderStatus = OrderStatus;
  readonly PaymentStatus = PaymentStatus;

  showFilters = false;

  filter: AdminOrderFilterModel = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'orderDate',
    sortOrder: 'desc',
    orderNumber: '',
    customerName: '',
    phoneNumber: '',
    orderStatus: null,
    paymentStatus: null,
    deliveryStatus: null,
    startDate: null,
    endDate: null,
    mangoType: '',
  };

  readonly orderStatusOptions = [
    { value: OrderStatus.Pending,    label: 'Pending' },
    { value: OrderStatus.Confirmed,  label: 'Confirmed' },
    { value: OrderStatus.Processing, label: 'Processing' },
    { value: OrderStatus.Shipped,    label: 'Shipped' },
    { value: OrderStatus.Delivered,  label: 'Delivered' },
    { value: OrderStatus.Cancelled,  label: 'Cancelled' },
    { value: OrderStatus.Returned,   label: 'Returned' },
    { value: OrderStatus.Failed,     label: 'Failed' },
  ];

  readonly paymentStatusOptions = [
    { value: PaymentStatus.Unpaid,  label: 'Unpaid' },
    { value: PaymentStatus.Paid,    label: 'Paid' },
    { value: PaymentStatus.Partial, label: 'Partial' },
    { value: PaymentStatus.Pending, label: 'Pending' },
    { value: PaymentStatus.Failed,  label: 'Failed' },
  ];

  readonly deliveryStatusOptions = [
    { value: DeliveryStatus.Pending,    label: 'Pending' },
    { value: DeliveryStatus.Dispatched, label: 'Dispatched' },
    { value: DeliveryStatus.InTransit,  label: 'In Transit' },
    { value: DeliveryStatus.Delivered,  label: 'Delivered' },
    { value: DeliveryStatus.Returned,   label: 'Returned' },
    { value: DeliveryStatus.Cancelled,  label: 'Cancelled' },
  ];

  constructor(
    private orderService: OrderService,
    private modalService: NgbModal,
    private signalR: SignalRService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => this.load());
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  load(): void {
    this.isLoading = true;
    this.subs.sink = this.orderService.getAdminPaged(this.filter).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      })
    ).subscribe({
      next: (res: any) => {
        this.orders = res?.data ?? [];
        this.totalCount = res?.totalCount ?? 0;
      },
      error: () => {
        this.orders = [];
        this.totalCount = 0;
      }
    });
  }

  onSort(field: string): void {
    const f = this.filter as any;
    const current = f as AdminOrderFilterModel;
    const updated = FilterUtils.updateSort(
      { ...current, offset: 0, limit: 0, isDesc: false, userId: 0 },
      field
    );
    this.filter = { ...this.filter, sortBy: updated.sortBy, sortOrder: updated.sortOrder };
    this.load();
  }

  applyFilters(): void {
    this.filter = { ...this.filter, pageNumber: 1 };
    this.load();
  }

  clearFilters(): void {
    this.filter = {
      ...this.filter,
      pageNumber: 1,
      orderNumber: '',
      customerName: '',
      phoneNumber: '',
      orderStatus: null,
      paymentStatus: null,
      deliveryStatus: null,
      startDate: null,
      endDate: null,
      mangoType: '',
    };
    this.load();
  }

  pageChanged(page: number): void {
    this.filter = { ...this.filter, pageNumber: page };
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.filter = { ...this.filter, pageNumber: 1, pageSize: size };
    this.load();
  }

  view(id: number): void {
    const ref = this.modalService.open(AdminOrderViewModalComponent, { size: 'lg' });
    ref.componentInstance.orderId = id;
    ref.result.then(() => {}, () => {});
  }

  openAction(order: AdminOrderListDto, action: 'confirm' | 'process' | 'ship' | 'deliver' | 'cancel'): void {
    const ref = this.modalService.open(AdminOrderActionModalComponent, { size: 'sm' });
    ref.componentInstance.orderId = order.orderId;
    ref.componentInstance.orderNumber = order.orderNumber;
    ref.componentInstance.action = action;
    ref.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      () => {}
    );
  }

  canConfirm(order: AdminOrderListDto): boolean {
    return order.orderStatus === OrderStatus.Pending;
  }

  canProcess(order: AdminOrderListDto): boolean {
    return order.orderStatus === OrderStatus.Confirmed;
  }

  canShip(order: AdminOrderListDto): boolean {
    return order.orderStatus === OrderStatus.Processing;
  }

  canDeliver(order: AdminOrderListDto): boolean {
    return order.orderStatus === OrderStatus.Shipped && order.paymentStatus === PaymentStatus.Paid;
  }

  canCancel(order: AdminOrderListDto): boolean {
    return [OrderStatus.Pending, OrderStatus.Confirmed, OrderStatus.Processing].includes(order.orderStatus);
  }

  getOrderStatusLabel(status: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusLabel(status);
  }

  getOrderStatusBadgeClass(status: OrderStatus): string {
    const classes: Record<number, string> = {
      [OrderStatus.Pending]:    'badge-light-warning',
      [OrderStatus.Confirmed]:  'badge-light-info',
      [OrderStatus.Processing]: 'badge-light-primary',
      [OrderStatus.Shipped]:    'badge-light-primary',
      [OrderStatus.Delivered]:  'badge-light-success',
      [OrderStatus.Cancelled]:  'badge-light-danger',
      [OrderStatus.Returned]:   'badge-light-warning',
      [OrderStatus.Failed]:     'badge-light-danger',
    };
    return classes[status] ?? 'badge-light-secondary';
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    const classes: Record<number, string> = {
      [PaymentStatus.Unpaid]:    'badge-light-danger',
      [PaymentStatus.Paid]:      'badge-light-success',
      [PaymentStatus.Partial]:   'badge-light-warning',
      [PaymentStatus.Pending]:   'badge-light-warning',
      [PaymentStatus.Failed]:    'badge-light-danger',
      [PaymentStatus.Refunded]:  'badge-light-info',
      [PaymentStatus.Cancelled]: 'badge-light-secondary',
    };
    return classes[status] ?? 'badge-light-secondary';
  }
}
