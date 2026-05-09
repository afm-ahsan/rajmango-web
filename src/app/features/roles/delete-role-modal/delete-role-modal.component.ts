import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { delay, tap, catchError, of, finalize } from 'rxjs';
import { SubSink } from 'subsink';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-delete-role-modal',
  templateUrl: './delete-role-modal.component.html',
  styleUrls: ['./delete-role-modal.component.scss'],
})
export class DeleteRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  subs = new SubSink();
  isLoading = false;

  constructor(
    private roleService: RoleService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {}

  delete() {
    this.isLoading = true;
    this.subs.sink = this.roleService
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
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

