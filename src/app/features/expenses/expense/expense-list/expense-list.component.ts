import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { SubSink } from 'subsink';
import _ from 'underscore';
import { ExpenseTypeService } from '../../expense-type/expense-type.service';
import { ExpenseTypeDto } from '../../expense-type/models/expense-type-dto.model';
import { CreateExpenseModalComponent } from '../create-expense-modal/create-expense-modal.component';
import { DeleteExpenseModalComponent } from '../delete-expense-modal/delete-expense-modal.component';
import { ExpenseService } from '../expense.service';
import { ExpenseDto } from '../models/expense-dto.model';
import { ViewExpenseModalComponent } from '../view-expense-modal/view-expense-modal.component';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss'],
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  searchVal = '';
  expenses: ExpenseDto[] = [];
  expenseTypes: ExpenseTypeDto[] = [];
  totalCount = 0;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private expenseService: ExpenseService,
    private expenseTypeService: ExpenseTypeService
  ) {}

  ngOnInit() {
    this.load();
    this.loadExpenseType();
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
    this.subs.sink = this.expenseService
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
          this.expenses = response.data ?? [];
          this.totalCount = response.totalCount ?? this.expenses.length;
        },
      });
  }

  onSearchChange(event: Event): void {
    this.searchVal = (event.target as HTMLInputElement).value;
    this.filter.pageNumber = 1;
    this.load();
  }

  loadExpenseType() {
    this.subs.sink = this.expenseTypeService
      .list()
      .subscribe((response: any) => {
        this.expenseTypes = response.data;
      });
  }

  getExpenseType(id: number) {
    var expenseType = _.find(this.expenseTypes, (item) => {
      return item.id == id;
    });
    if (expenseType) {
      return expenseType.name;
    }
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateExpenseModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.expenseTypes = this.expenseTypes;
    modalRef.result.then(
      () => {
        this.load();
      },
      () => {}
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteExpenseModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      () => {}
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewExpenseModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.expenseType = this.getExpenseType(id);
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
