import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { DropdownModel } from 'src/app/shared/models/dropdown.model';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubSink } from 'subsink';
import _ from 'underscore';
import { CreateCustomerModalComponent } from '../create-customer-modal/create-customer-modal.component';
import { CustomerService } from '../customer.service';
import { DeleteCustomerModalComponent } from '../delete-customer-modal/delete-customer-modal.component';
import { CustomerDto } from '../models/customer-dto.model';
import { ViewCustomerModalComponent } from '../view-customer-modal/view-customer-modal.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean;
  customers: CustomerDto[] = [];
  totalCount = 10;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'customerName',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };
  ddlCustomerTypes: DropdownModel[] = [
    { id: 1, label: 'Walking' },
    { id: 2, label: 'Registered' },
    { id: 3, label: 'Guest' },
    { id: 4, label: 'VIP' },
  ];

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.loaderService.show();
    const pagedAndSortedDto: PagedAndSortedDto = {
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
      sortBy: this.filter.sortBy,
      sortOrder: this.filter.sortOrder,
      filter: '',
      userId: 0,
    };

    this.subs.sink = this.customerService
      .getAll(pagedAndSortedDto)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.loaderService.hide();
          this.cdRef.detectChanges();
          MenuComponent.reinitialization();
        })
      )
      .subscribe({
        next: (response: any) => {
          this.customers = response.data;
        },
      });
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateCustomerModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteCustomerModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  view(id: number, customerType: number): void {
    const modalRef = this.modalService.open(ViewCustomerModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.customerType = this.getCustomerType(customerType);
    modalRef.result.then(
      () => { this.load(); },
      () => {}
    );
  }

  getCustomerType(customerTypeId: number) {
    var customerType = _.find(this.ddlCustomerTypes, (item) => {
      return item.id == customerTypeId;
    });
    if (customerType) {
      return customerType.label;
    }
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
