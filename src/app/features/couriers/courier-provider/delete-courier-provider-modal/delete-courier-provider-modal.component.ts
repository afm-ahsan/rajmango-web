import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, delay, finalize, of } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierProviderService } from '../courier-provider.service';

@Component({
  selector: 'app-delete-courier-provider-modal',
  templateUrl: './delete-courier-provider-modal.component.html',
  styleUrls: ['./delete-courier-provider-modal.component.scss']
})
export class DeleteCourierProviderModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierProviderService: CourierProviderService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // Component init logic (if needed)
  }

  delete(): void {
    if (!this.id) {
      this.modal.dismiss('Invalid courier provider ID');
      return;
    }

    this.isLoading = true;

    this.subs.sink = this.courierProviderService
      .delete(this.id)
      .pipe(
        delay(600), // Optional: purely for UI feedback, can remove in production
        catchError((error) => {
          this.modal.dismiss(error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(() => {
        this.modal.close('success');
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
