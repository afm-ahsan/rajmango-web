import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth';
import { CreateOrderModalComponent } from '../create-order-modal/create-order-modal.component';
import { DeleteOrderModalComponent } from '../delete-order-modal/delete-order-modal.component';
import { OrderDto } from '../models/order-dto.model';
import { OrderFacade } from '../order.facade';
import { OrderService } from '../order.service';
import { ViewOrderModalComponent } from '../view-order-modal/view-order-modal.component';
import { SubmitFeedbackModalComponent } from 'src/app/features/feedback/submit-feedback-modal/submit-feedback-modal.component';
import { SubmitComplaintModalComponent } from 'src/app/features/complaints/submit-complaint-modal/submit-complaint-modal.component';
import { SignalRService } from 'src/app/shared/services/signalr.service';
import { BkashPaymentModalComponent } from '../bkash-payment-modal/bkash-payment-modal.component';

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
    private router: Router,
    private orderService: OrderService
  ) {
    this.filter.userId = this.authService.getLoggedUserId();
  }

  // 3. Lifecycle Hooks
  ngOnInit(): void {
    this.load();
    this.route.queryParams.subscribe((params) => {
      const mangoTypeId = +params['mangoTypeId'];
      if (mangoTypeId) {
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
        this.openCreateModal(0, mangoTypeId);
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

  getPaymentStatusLabel(paymentStatus: PaymentStatus): string {
      return EnumLabelUtils.getPaymentStatusLabel(paymentStatus)
    }

  getOrderStatusLabel(orderStatus: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusLabel(orderStatus);
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
    const modalRef = this.modalService.open(ViewOrderModalComponent, { size: 'md' });
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

  isPayable(order: OrderDto): boolean {
    // Guard: cancelled orders cannot be paid
    const os = Number(order.orderStatus);
    if (os === OrderStatus.Cancelled || os === OrderStatus.Returned) return false;

    // Normalise paymentStatus to a number whether the API sends an int or a string
    const rawPs = order.paymentStatus as any;
    let ps: number;
    if (typeof rawPs === 'string') {
      // Backend sent a string name — resolve via enum reverse mapping
      ps = (PaymentStatus as any)[rawPs] as number ?? -1;
    } else {
      ps = Number(rawPs);
    }

    // Never show Payment for already-paid / refunded / payment-cancelled
    if (ps === PaymentStatus.Paid || ps === PaymentStatus.Refunded || ps === PaymentStatus.Cancelled) return false;

    // Show Payment for None(0), Unpaid(1), Partial(3), Failed(4) — as long as there is an amount outstanding
    const outstanding = (order.dueAmount != null && order.dueAmount > 0)
      ? order.dueAmount
      : order.totalAmount;
    return outstanding > 0;
  }

  openPayment(order: OrderDto): void {
    const ref = this.modalService.open(BkashPaymentModalComponent, { size: 'lg' });
    this.subs.sink = this.orderService.getById(order.id).subscribe({
      next: (res) => {
        ref.componentInstance.order = res?.data ?? order;
      },
      error: () => {
        ref.componentInstance.order = order;
      }
    });
    ref.result.then(
      () => {},
      () => {}
    );
  }

  // 6. Utility Methods
  getImagePath(serverPath: string): string {
    return this.imagePathService.createFullPath(serverPath);
  }
}