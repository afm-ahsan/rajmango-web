import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of, tap } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubSink } from 'subsink';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-delete-order-modal',
  templateUrl: './delete-order-modal.component.html',
  styleUrls: ['./delete-order-modal.component.scss']
})
export class DeleteOrderModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  isLoading = false;
  private subs = new SubSink();

  constructor(
    private orderService: OrderService,
    private loaderService: LoaderService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.loaderService.show();

    this.subs.sink = this.orderService
      .delete(this.id)
      .pipe(
        tap(() => this.modal.close('success')),
        catchError((error) => {
          this.modal.dismiss(error);
          return of(undefined);
        }),
        finalize(() => {
          this.isLoading = false;
          this.loaderService.hide();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
