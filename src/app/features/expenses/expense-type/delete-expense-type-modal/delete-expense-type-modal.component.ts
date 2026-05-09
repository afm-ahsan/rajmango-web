import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { ExpenseTypeService } from '../expense-type.service';

@Component({
  selector: 'app-delete-expense-type-modal',
  templateUrl: './delete-expense-type-modal.component.html',
  styleUrls: ['./delete-expense-type-modal.component.scss']
})
export class DeleteExpenseTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private expenseTypeService: ExpenseTypeService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete() {
    this.isLoading = true;
    this.subs.sink = this.expenseTypeService
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

