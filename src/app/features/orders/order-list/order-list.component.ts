import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { SubmitComplaintModalComponent } from 'src/app/features/complaints/submit-complaint-modal/submit-complaint-modal.component';
import { SubmitFeedbackModalComponent } from 'src/app/features/feedback/submit-feedback-modal/submit-feedback-modal.component';
import { DeliveryStatus } from 'src/app/shared/enums/delivery-status.enum';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth';
import { BkashPaymentModalComponent } from '../bkash-payment-modal/bkash-payment-modal.component';
import { CreateOrderModalComponent } from '../create-order-modal/create-order-modal.component';
import { DeleteOrderModalComponent } from '../delete-order-modal/delete-order-modal.component';
import { OrderDto } from '../models/order-dto.model';
import { OrderFacade } from '../order.facade';
import { ViewOrderModalComponent } from '../view-order-modal/view-order-modal.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  // 1. Class Properties
  subs = new SubSink();
  isLoading = false;
  orders: OrderDto[] = [];
  totalCount = 0;
  searchVal = '';
  userId = 0;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'orderDate',
    sortOrder: 'desc',
    isDesc: false,
    userId: 0
  };

  // 2. Constructor (DI)
  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private orderFacade: OrderFacade,
    private authService: AuthService,
    private imagePathService: ImagePathService,
    private signalR: SignalRService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.filter.userId = this.authService.getLoggedUserId();
  }

  // 3. Lifecycle Hooks
  ngOnInit(): void {
    this.load();
    this.route.queryParams.subscribe((params) => {
      const mangoTypeId = +params['mangoTypeId'];
      const openNew = params['new'] === '1';
      if (mangoTypeId) {
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        this.openCreateModal(0, mangoTypeId);
      } else if (openNew) {
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        this.openCreateModal(0);
      }
    });
    this.subscribeToRealtime();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // 4. Public Methods
  load(): void {
    this.isLoading = true;
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.orderFacade.getPagedWithCount(dto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: ([data, count]) => {
          this.orders = data;
          this.totalCount = count;
        },
        error: () => {
          this.orders = [];
          this.totalCount = 0;
        },
      });
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

  getMangoTypeNames(order: OrderDto): string {
    const names = (order.orderDetails ?? []).map(d => d.mangoName).filter(Boolean);
    return names.length ? names.join(', ') : '-';
  }

  create(): void {
    this.openCreateModal(0);
  }

  edit(id: number): void {
    this.openCreateModal(id);
  }

  openCreateModal(id: number, mangoTypeId: number = 0): void {
    const modalRef = this.modalService.open(CreateOrderModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.mangoTypeId = mangoTypeId;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      () => {}
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteOrderModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      () => {}
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewOrderModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      () => {}
    );
  }

  // 5. Event Handlers
  onSort(field: string): void {
    this.filter = FilterUtils.updateSort(this.filter, field);
    this.load();
  }

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchVal = target.value;
    this.load();
  }

  pageChanged(page: number): void {
    this.filter.pageNumber = page;
    this.load();
  }

  pageSizeChanged(size: number): void {
    this.filter.pageNumber = 1;
    this.filter.pageSize = size;
    this.load();
  }

  private subscribeToRealtime(): void {
    this.subs.sink = this.signalR.orderCreated$.subscribe((p) => {
      this.load();
      this.toast('info', `New order ${p.orderNumber} placed.`);
    });
    this.subs.sink = this.signalR.orderStatusUpdated$.subscribe((p) => {
      this.load();
      this.toast('info', `Order ${p.orderNumber} status: ${p.status}.`);
    });
  }

  private toast(icon: 'success' | 'info' | 'warning' | 'error', title: string): void {
    Swal.fire({ toast: true, position: 'top-end', icon, title, showConfirmButton: false, timer: 3500, timerProgressBar: true });
  }

  trackOrder(orderNumber: string): void {
    window.open(`/track-order?orderNumber=${encodeURIComponent(orderNumber)}`, '_blank');
  }

  openFeedback(order: OrderDto): void {
    const ref = this.modalService.open(SubmitFeedbackModalComponent, { size: 'md' });
    ref.componentInstance.orderId = order.id;
    ref.componentInstance.orderNumber = order.orderNumber;
  }

  openComplaint(order: OrderDto): void {
    const ref = this.modalService.open(SubmitComplaintModalComponent, { size: 'md' });
    ref.componentInstance.orderId = order.id;
    ref.componentInstance.orderNumber = order.orderNumber;
  }

  isEditable(order: OrderDto): boolean {
    const os = Number(order.orderStatus);
    const ps = this.resolvePaymentStatus(order.paymentStatus);
    const ds = Number(order.deliveryStatus);
    return os === OrderStatus.Pending && ps === PaymentStatus.Unpaid && ds === DeliveryStatus.Pending;
  }

  isPayable(order: OrderDto): boolean {
    return this.resolvePaymentStatus(order.paymentStatus) !== PaymentStatus.Paid;
  }

  private resolvePaymentStatus(raw: any): number {
    if (typeof raw === 'string') {
      return (PaymentStatus as any)[raw] as number ?? -1;
    }
    return Number(raw);
  }

  openPayment(order: OrderDto): void {
    const ref = this.modalService.open(BkashPaymentModalComponent, { size: 'lg' });
    ref.componentInstance.orderId = order.id;
    ref.result.then(
      (result: string) => { if (result === 'refresh') this.load(); },
      () => {}
    );
  }

  // 6. Utility Methods
  getImagePath(serverPath: string): string {
    return this.imagePathService.createFullPath(serverPath);
  }
}