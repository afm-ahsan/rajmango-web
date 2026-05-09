import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-delete-expense-modal',
  templateUrl: './delete-expense-modal.component.html',
  styleUrls: ['./delete-expense-modal.component.scss'],
})
export class DeleteExpenseModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private expenseService: ExpenseService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete() {
    this.isLoading = true;
    this.subs.sink = this.expenseService
      .delete(this.id)
      .pipe(
        delay(1000), // Remove it from your code (just for showing loading)
        tap(() => this.modal.close()),
        catchError((error) => {
          this.modal.dismiss(error);
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
