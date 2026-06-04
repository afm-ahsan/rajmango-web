import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { FilterUtils } from 'src/app/shared/utils/filter-utils';
import { SubSink } from 'subsink';
import { RoleService } from '../role.service';
import { CreateRoleModalComponent } from '../create-role-modal/create-role-modal.component';
import { DeleteRoleModalComponent } from '../delete-role-modal/delete-role-modal.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading = false;
  roles: any[] = [];
  totalCount = 0;
  searchVal = '';
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'name',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private roleService: RoleService
  ) {}

  ngOnInit() { this.load(); }

  load() {
    this.isLoading = true;
    const dto = FilterUtils.createPagedRequest(this.filter, this.searchVal);
    this.subs.sink = this.roleService.getAll(dto).pipe(
      finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      })
    ).subscribe({
      next: (response: any) => {
        this.roles = response.data ?? [];
        this.totalCount = response.totalCount ?? this.roles.length;
      },
    });
  }

  onSearchChange(event: Event): void {
    this.searchVal = (event.target as HTMLInputElement).value;
    this.filter.pageNumber = 1;
    this.load();
  }

  create() { this.openModal(0, 'create'); }
  edit(id: number): void { this.openModal(id, 'edit'); }
  view(id: number): void { this.openModal(id, 'view'); }

  private openModal(id: number, mode: 'create' | 'edit' | 'view'): void {
    const modalRef = this.modalService.open(CreateRoleModalComponent, { size: 'md' });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.mode = mode;
    modalRef.result.then(() => { this.load(); }, () => {});
  }

  delete(id: number): void {
    const modalRef = this.modalService.open(DeleteRoleModalComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then(() => { this.load(); }, () => {});
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

  ngOnDestroy() { this.subs.unsubscribe(); }
}
