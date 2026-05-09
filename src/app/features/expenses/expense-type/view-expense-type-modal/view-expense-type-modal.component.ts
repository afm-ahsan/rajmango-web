import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { ExpenseTypeService } from '../expense-type.service';
import { ExpenseTypeDto } from '../models/expense-type-dto.model';

@Component({
  selector: 'app-view-expense-type-modal',
  templateUrl: './view-expense-type-modal.component.html',
  styleUrls: ['./view-expense-type-modal.component.scss'],
})
export class ViewExpenseTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  subs = new SubSink();
  isLoading = false;
  expenseTypeDto: ExpenseTypeDto = {} as ExpenseTypeDto;

  constructor(
    public modal: NgbActiveModal,
    private expenseTypeService: ExpenseTypeService
  ) {}

  ngOnInit(): void {
    this.loadExpenseType();
  }

  loadExpenseType() {
    this.isLoading = true;
    this.subs.sink = this.expenseTypeService.getItem(this.id).subscribe(
      (expenseTypeDto: any) => {
        this.expenseTypeDto = expenseTypeDto.data;
        this.isLoading = false;
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
