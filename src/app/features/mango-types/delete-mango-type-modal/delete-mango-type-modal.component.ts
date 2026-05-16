import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
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