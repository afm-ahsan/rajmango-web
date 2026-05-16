import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
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
        finalize(() => { this.isLoading = false; })
      )
      .subscribe({
        next: () => this.modal.close('success'),
        error: (err) => this.modal.dismiss(err)
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

