import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { ExpenseService } from '../expense.service';
import { ExpenseDto } from '../models/expense-dto.model';

@Component({
  selector: 'app-view-expense-modal',
  templateUrl: './view-expense-modal.component.html',
  styleUrls: ['./view-expense-modal.component.scss'],
})
export class ViewExpenseModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() expenseType: string;
  subs = new SubSink();
  isLoading = false;
  expenseDto: ExpenseDto = {} as ExpenseDto;

  constructor(
    public modal: NgbActiveModal,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.loadExpense();
  }

  loadExpense() {
    this.isLoading = true;
    this.subs.sink = this.expenseService.getItem(this.id).subscribe(
      (expenseDto: any) => {
        this.expenseDto = expenseDto.data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.modal.dismiss();
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}