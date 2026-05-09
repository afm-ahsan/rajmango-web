import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { OrderStatus } from 'src/app/shared/enums/order-status.enum';
import { PaymentStatus } from 'src/app/shared/enums/payment_status.enum';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { ImagePathService } from 'src/app/shared/services/image-path.service';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { EnumLabelUtils } from 'src/app/shared/utils/enum-label.utils';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { AuthService } from '../../auth';
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
    private loaderService: LoaderService,
    private orderFacade: OrderFacade,
    private authService: AuthService,
    private imagePathService: ImagePathService
  ) {
    this.filter.userId = this.authService.getLoggedUserId();
  }

  // 3. Lifecycle Hooks
  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // 4. Public Methods
  load(): void {
    this.isLoading = true;
    this.loaderService.show();
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.orderFacade.getPagedWithCount(dto)
      .subscribe(([data, count]) => {
        this.orders = data;
        this.totalCount = count;
        this.isLoading = false;
        this.loaderService.hide();
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      });
  }

  getPaymentStatusLabel(paymentStatus: PaymentStatus): string {
      return EnumLabelUtils.getPaymentStatusLabel(paymentStatus)
    }

  getOrderStatusLabel(orderStatus: OrderStatus): string {
    return EnumLabelUtils.getOrderStatusLabel(orderStatus);
  }

  create(): void {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateOrderModalComponent, { size: 'lg' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') 
          this.load();
      },
      (error: any) => console.warn('Modal dismissed:', error)
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteOrderModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      (error: any) => console.warn('Modal dismissed:', error)
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewOrderModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      (result: 'success' | 'dismissed') => {
        if (result === 'success') this.load();
      },
      (error: any) => console.warn('Modal dismissed:', error)
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

  // 6. Utility Methods
  getImagePath(serverPath: string): string {
    return this.imagePathService.createFullPath(serverPath);
  }
}