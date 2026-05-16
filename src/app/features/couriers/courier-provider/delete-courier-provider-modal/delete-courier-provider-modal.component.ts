import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { CourierProviderService } from '../courier-provider.service';

@Component({
  selector: 'app-delete-courier-provider-modal',
  templateUrl: './delete-courier-provider-modal.component.html',
  styleUrls: ['./delete-courier-provider-modal.component.scss']
})
export class DeleteCourierProviderModalComponent implements OnInit, OnDestroy {
  @Input() id: string;

  isLoading = false;
  private subs = new SubSink();

  constructor(
    private courierProviderService: CourierProviderService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete(): void {
    this.isLoading = true;
    this.subs.sink = this.courierProviderService
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
