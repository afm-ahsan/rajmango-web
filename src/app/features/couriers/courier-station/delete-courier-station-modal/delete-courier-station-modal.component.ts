import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, catchError, of, finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierStationService } from '../courier-station.service';

@Component({
  selector: 'app-delete-courier-station-modal',
  templateUrl: './delete-courier-station-modal.component.html',
  styleUrls: ['./delete-courier-station-modal.component.scss']
})
export class DeleteCourierStationModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierStationService: CourierStationService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // Component init logic (if needed)
  }

  delete(): void {
    if (!this.id) {
      this.modal.dismiss('Invalid courier station ID');
      return;
    }

    this.isLoading = true;

    this.subs.sink = this.courierStationService
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
