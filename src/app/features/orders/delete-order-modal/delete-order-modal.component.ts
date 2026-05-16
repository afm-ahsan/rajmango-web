import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
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
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.subs.sink = this.orderService
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
