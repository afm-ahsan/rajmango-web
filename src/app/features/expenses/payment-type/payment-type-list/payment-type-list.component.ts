import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { SubSink } from 'subsink';
import { PaymentMethodDto } from '../models/payment-method-dto.model';
import { PaymentTypeService } from '../payment-type.service';
import { ViewPaymentTypeModalComponent } from '../view-payment-type-modal/view-payment-type-modal.component';
import { CreatePaymentTypeModalComponent } from '../create-payment-type-modal/create-payment-type-modal.component';
import { DeletePaymentTypeModalComponent } from '../delete-payment-type-modal/delete-payment-type-modal.component';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';

@Component({
  selector: 'app-payment-type-list',
  templateUrl: './payment-type-list.component.html',
  styleUrls: ['./payment-type-list.component.scss'],
})
export class PaymentTypeListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  searchVal = '';
  paymentMethods: PaymentMethodDto[] = [];
  totalCount = 0;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'expenseTypeName',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private paymentTypeService: PaymentTypeService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    const pagedAndSortedDto: PagedAndSortedDto = {
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
      sortBy: this.filter.sortBy,
      sortOrder: this.filter.sortOrder,
      filter: this.searchVal,
      userId: 0,
    };
    this.subs.sink = this.paymentTypeService
      .getAll(pagedAndSortedDto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.paymentMethods = response.data ?? [];
          this.totalCount = response.totalCount ?? this.paymentMethods.length;
        },
      });
  }

  onSearchChange(event: Event): void {
    this.searchVal = (event.target as HTMLInputElement).value;
    this.filter.pageNumber = 1;
    this.load();
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreatePaymentTypeModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      () => {}
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeletePaymentTypeModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      () => {}
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewPaymentTypeModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => { this.load(); },
      () => {}
    );
  }

  pageChanged($event: any) {
    this.filter.pageNumber = $event;
    this.load();
  }

  pageSizeChanged($event: any) {
    this.filter.pageNumber = 1;
    this.filter.pageSize = $event;
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}

