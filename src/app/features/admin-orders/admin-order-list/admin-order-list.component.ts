import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { UserPermissionKey } from 'src/app/core/constants/user-permission-keys.enum';
import { UserPermissionService } from 'src/app/features/auth/services/user-permission.service';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { CourierAreaMapService } from '../../couriers/courier-area-map/courier-area-map.service';
import { CourierProviderService } from '../../couriers/courier-provider/courier-provider.service';
import { MangoTypeService } from '../../mango-types/mango-type.service';
import { AdminOrderFilterModel, AdminOrderListDto } from '../../orders/models/admin-order-list-dto.model';
import { OrderService } from '../../orders/order.service';
import { CreateOrderModalComponent } from '../../orders/create-order-modal/create-order-modal.component';
import { AdminOrderActionModalComponent } from '../admin-order-action-modal/admin-order-action-modal.component';
import { AdminOrderUpdateStatusModalComponent } from '../admin-order-update-status-modal/admin-order-update-status-modal.component';
import { AdminOrderViewModalComponent } from '../admin-order-view-modal/admin-order-view-modal.component';

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

  showFilters = true;
  showDivider = false;
  hasLoaded = false;
  hasAdminManage = false;

  deliveryAreaOptions: { id: number; name: string }[] = [];
  isAreaFilterSearching = false;
  areaFilterHasNoMatch = false;
  deliveryAreaTypeahead$ = new Subject<string>();
  mangoTypeOptions: { id: number; name: string }[] = [];
  courierProviderOptions: { id: number; name: string }[] = [];

  summary = { totalQuantityKg: 0, crate10KgCount: 0, crate20KgCount: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 };

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
    courierProviderId: null,
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
    private mangoTypeService: MangoTypeService,
    private courierProviderService: CourierProviderService
  ) {}

  ngOnInit(): void {
    this.hasAdminManage = this.permissionService.hasAccess(UserPermissionKey.HasAdminOrdersManageAccess);
    this.setupDeliveryAreaTypeahead();
    this.loadDropdowns();
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe(() => {
      if (this.hasLoaded) this.load();
    });
  }

  private setupDeliveryAreaTypeahead(): void {
    this.subs.sink = this.deliveryAreaTypeahead$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => !!term && term.length >= 2),
      tap(() => { this.isAreaFilterSearching = true; this.areaFilterHasNoMatch = false; this.cdRef.detectChanges(); }),
      switchMap(term => this.courierAreaMapService.search(term).pipe(
        catchError(() => of({ data: [] }))
      ))
    ).subscribe(res => {
      const seen = new Set<string>();
      const realAreas = (res.data ?? []).filter((a: any) => {
        const key = (a.name ?? '').trim().toLowerCase();
        if (key === 'others' || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      this.areaFilterHasNoMatch = realAreas.length === 0;

      this.deliveryAreaOptions = [
        ...realAreas,
        {
          id: -1,
          name: 'Others',
          label: 'Others – My delivery area is not listed. I will provide my full delivery address.',
        },
      ];
      this.isAreaFilterSearching = false;
      this.cdRef.detectChanges();
    });
  }

  onDeliveryAreaFilterChanged(value: any): void {
    if (!value) {
      this.deliveryAreaOptions = [];
      this.areaFilterHasNoMatch = false;
      this.cdRef.detectChanges();
    }
  }

  private loadDropdowns(): void {
    this.subs.sink = this.mangoTypeService.list().subscribe({
      next: (res: any) => { this.mangoTypeOptions = Array.isArray(res) ? res : (res?.data ?? []); },
      error: () => {}
    });
    this.subs.sink = this.courierProviderService.getDropdown().subscribe({
      next: (res: any) => { this.courierProviderOptions = Array.isArray(res) ? res : (res?.data ?? []); },
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
        this.summary = {
          totalQuantityKg: res?.summaryTotalQuantityKg ?? 0,
          crate10KgCount:  res?.summaryCrate10KgCount  ?? 0,
          crate20KgCount:  res?.summaryCrate20KgCount  ?? 0,
          totalAmount:     res?.summaryTotalAmount      ?? 0,
          totalPaid:       res?.summaryTotalPaid        ?? 0,
          totalDue:        res?.summaryTotalDue         ?? 0,
        };
      },
      error: () => {
        this.orders = [];
        this.totalCount = 0;
        this.summary = { totalQuantityKg: 0, crate10KgCount: 0, crate20KgCount: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 };
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
    this.hasLoaded = true;
    this.showFilters = true;
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
      courierProviderId: null,
      deliveryArea: undefined,
      receiverMobile: '',
    };
    this.hasLoaded = false;
    this.showFilters = true;
    this.orders = [];
    this.totalCount = 0;
    this.summary = { totalQuantityKg: 0, crate10KgCount: 0, crate20KgCount: 0, totalAmount: 0, totalPaid: 0, totalDue: 0 };
    this.cdRef.detectChanges();
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

  edit(orderId: number): void {
    const ref = this.modalService.open(CreateOrderModalComponent, { size: 'lg' });
    ref.componentInstance.id = orderId;
    ref.result.then(
      (result: 'success' | 'dismissed') => { if (result === 'success') this.load(); },
      () => {}
    );
  }

  openUpdateStatus(order: AdminOrderListDto): void {
    const ref = this.modalService.open(AdminOrderUpdateStatusModalComponent, { size: 'md' });
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
