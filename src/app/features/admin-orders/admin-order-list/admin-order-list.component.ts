import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { SubSink } from 'subsink';
import { CourierAreaMapService } from '../../couriers/courier-area-map/courier-area-map.service';
import { MangoTypeService } from '../../mango-types/mango-type.service';
import { OrderService } from '../../orders/order.service';
import { AdminOrderFilterModel, AdminOrderListDto } from '../../orders/models/admin-order-list-dto.model';
import { AdminOrderViewModalComponent } from '../admin-order-view-modal/admin-order-view-modal.component';
import { AdminOrderActionModalComponent } from '../admin-order-action-modal/admin-order-action-modal.component';
import { AdminOrderUpdateStatusModalComponent } from '../admin-order-update-status-modal/admin-order-update-status-modal.component';

// ReceiverType enum mirror for template use
const RECEIVER_SELF = 0;

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
  readonly DeliveryStatus = DeliveryStatus;
  readonly RECEIVER_SELF = RECEIVER_SELF;

  showFilters = false;
  showDivider = false;
  hasAdminManage = false;

  deliveryAreaOptions: { id: number; name: string }[] = [];
  mangoTypeOptions: { id: number; name: string }[] = [];

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
    courierEligibleOnly: false,
    deliveryArea: undefined,
    receiverMobile: '',
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
    private cdRef: ChangeDetectorRef,
    private permissionService: UserPermissionService,
    private courierAreaMapService: CourierAreaMapService,
    private mangoTypeService: MangoTypeService
  ) {}

  ngOnInit(): void {
    this.hasAdminManage = this.permissionService.hasAccess(UserPermissionKey.HasAdminOrdersManageAccess);
    this.loadDropdowns();
    this.load();
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => this.load());
  }

  private loadDropdowns(): void {
    this.subs.sink = this.courierAreaMapService.getDropdown().subscribe({
      next: (res: any) => { this.deliveryAreaOptions = Array.isArray(res) ? res : (res?.data ?? []); },
      error: () => {}
    });
    this.subs.sink = this.mangoTypeService.list().subscribe({
      next: (res: any) => { this.mangoTypeOptions = Array.isArray(res) ? res : (res?.data ?? []); },
      error: () => {}
    });
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) this.showDivider = false;
  }

  applyFilters(): void {
    this.filter = { ...this.filter, pageNumber: 1 };
    this.showDivider = true;
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
      courierEligibleOnly: false,
      deliveryArea: undefined,
      receiverMobile: '',
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

  openUpdateStatus(order: AdminOrderListDto): void {
    const ref = this.modalService.open(AdminOrderUpdateStatusModalComponent, { size: 'sm' });
    ref.componentInstance.order = order;
    ref.result.then(
      (result: 'success' | 'dismissed') => { if (result === 'success') this.load(); },
      () => {}
    );
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
    return EnumLabelUtils.getOrderStatusBadgeClass(status);
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusLabel(status);
  }

  getPaymentStatusBadgeClass(status: PaymentStatus): string {
    return EnumLabelUtils.getPaymentStatusBadgeClass(status);
  }

  getDeliveryStatusLabel(status: DeliveryStatus): string {
    return EnumLabelUtils.getDeliveryStatusLabel(status);
  }

  getDeliveryStatusBadgeClass(status: DeliveryStatus): string {
    return EnumLabelUtils.getDeliveryStatusBadgeClass(status);
  }
}
