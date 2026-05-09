import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { SubSink } from 'subsink';
import { CreateExpenseTypeModalComponent } from '../create-expense-type-modal/create-expense-type-modal.component';
import { DeleteExpenseTypeModalComponent } from '../delete-expense-type-modal/delete-expense-type-modal.component';
import { ExpenseTypeService } from '../expense-type.service';
import { ExpenseTypeDto } from '../models/expense-type-dto.model';
import { ViewExpenseTypeModalComponent } from '../view-expense-type-modal/view-expense-type-modal.component';

@Component({
  selector: 'app-expense-type-list',
  templateUrl: './expense-type-list.component.html',
  styleUrls: ['./expense-type-list.component.scss'],
})
export class ExpenseTypeListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean;
  expenseTypes: ExpenseTypeDto[] = [];
  totalCount = 10;
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
    private expenseTypeService: ExpenseTypeService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    //this.filter.limit = this.filter.pageSize;
    //this.filter.offset = (this.filter.pageNo - 1) * this.filter.pageSize;
    var pagedAndSortedDto: PagedAndSortedDto = {
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
      sortBy: this.filter.sortBy,
      sortOrder:  this.filter.sortOrder,
      filter: '',
      userId: 0,
    };

    this.subs.sink = this.expenseTypeService
      .getAll(pagedAndSortedDto)
      .subscribe((response: any) => {
        this.isLoading = false;
        this.expenseTypes = response.data;
        console.log(response);
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      });
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateExpenseTypeModalComponent, {
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
    const modalRef = this.modalService.open(DeleteExpenseTypeModalComponent);
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

  view(id: number): void {
    const modalRef = this.modalService.open(ViewExpenseTypeModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => {
      this.load();
    });
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

