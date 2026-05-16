import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { GetAllRoleDto, RoleServiceProxy } from 'src/app/services/client-proxy';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { SubSink } from 'subsink';
import { CreateRoleModalComponent } from '../create-role-modal/create-role-modal.component';
import { DeleteRoleModalComponent } from '../delete-role-modal/delete-role-modal.component';
import { ViewRoleModalComponent } from '../view-role-modal/view-role-modal.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean;
  roles: GetAllRoleDto[] = [];
  totalCount = 0;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'roleName',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    private roleProxy: RoleServiceProxy
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.loaderService.show();
    this.subs.sink = this.roleProxy.get().pipe(
      finalize(() => {
        this.isLoading = false;
        this.loaderService.hide();
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      })
    ).subscribe({
      next: (res) => {
        this.roles = res.data ?? [];
        this.totalCount = this.roles.length;
      },
    });
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateRoleModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteRoleModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => {
        this.load();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  view(id: number): void {
    const modalRef = this.modalService.open(ViewRoleModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.result.then(
      () => { this.load(); },
      () => {}
    );
  }

  pageChanged($event: any) {
    this.filter.pageNumber = $event;
    this.load();
  }

  pageSizeChanged($event: any) {
    this.filter.pageNumber = 1;
    this.filter.pageSize = $event;
    this.load();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
