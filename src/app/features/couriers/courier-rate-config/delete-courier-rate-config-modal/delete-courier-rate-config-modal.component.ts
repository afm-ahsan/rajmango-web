import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierRateConfigService } from '../courier-rate-config.service';

@Component({
  selector: 'app-delete-courier-rate-config-modal',
  templateUrl: './delete-courier-rate-config-modal.component.html',
  styleUrls: ['./delete-courier-rate-config-modal.component.scss']
})
export class DeleteCourierRateConfigModalComponent implements OnInit, OnDestroy {
  @Input() id: number;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private service: CourierRateConfigService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.subs.sink = this.service.delete(this.id)
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
