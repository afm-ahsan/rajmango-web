import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, finalize, of } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierAreaMapService } from '../courier-area-map.service';

@Component({
  selector: 'app-delete-courier-area-map-modal',
  templateUrl: './delete-courier-area-map-modal.component.html',
  styleUrls: ['./delete-courier-area-map-modal.component.scss']
})
export class DeleteCourierAreaMapModalComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierAreaMapService: CourierAreaMapService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    // Component init logic (if needed)
  }

  delete(): void {
    if (!this.id) {
      this.modal.dismiss('Invalid courier area map ID');
      return;
    }

    this.isLoading = true;

    this.subs.sink = this.courierAreaMapService
      .delete(this.id)
      .pipe(
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
