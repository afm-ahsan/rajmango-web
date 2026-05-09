import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { MangoTypeService } from '../mango-type.service';

@Component({
  selector: 'app-delete-mango-type-modal',
  templateUrl: './delete-mango-type-modal.component.html',
  styleUrls: ['./delete-mango-type-modal.component.scss']
})
export class DeleteMangoTypeModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private mangoTypeService: MangoTypeService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete() {
    this.isLoading = true;
    this.subs.sink = this.mangoTypeService
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
          this.modal.close('success');
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}