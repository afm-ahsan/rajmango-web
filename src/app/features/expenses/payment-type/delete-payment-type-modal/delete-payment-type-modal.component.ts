import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { PaymentTypeService } from '../payment-type.service';


@Component({
  selector: 'app-delete-payment-type-modal',
  templateUrl: './delete-payment-type-modal.component.html',
  styleUrls: ['./delete-payment-type-modal.component.scss']
})
export class DeletePaymentTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private paymentTypeService: PaymentTypeService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete() {
    this.isLoading = true;
    this.subs.sink = this.paymentTypeService
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

