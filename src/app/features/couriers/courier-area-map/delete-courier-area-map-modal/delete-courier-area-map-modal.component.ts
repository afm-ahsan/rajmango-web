import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierAreaMapService } from '../courier-area-map.service';

@Component({
  selector: 'app-delete-courier-area-map-modal',
  templateUrl: './delete-courier-area-map-modal.component.html',
  styleUrls: ['./delete-courier-area-map-modal.component.scss']
})
export class DeleteCourierAreaMapModalComponent implements OnInit, OnDestroy {
  @Input() id: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierAreaMapService: CourierAreaMapService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.subs.sink = this.courierAreaMapService
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
