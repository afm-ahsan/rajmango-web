import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierStationService } from '../courier-station.service';

@Component({
  selector: 'app-delete-courier-station-modal',
  templateUrl: './delete-courier-station-modal.component.html',
  styleUrls: ['./delete-courier-station-modal.component.scss']
})
export class DeleteCourierStationModalComponent implements OnInit, OnDestroy {
  @Input() id: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierStationService: CourierStationService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.subs.sink = this.courierStationService
      .delete(this.id)
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: () => this.modal.close('success'),
        error: (err) => this.modal.dismiss(err)
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
