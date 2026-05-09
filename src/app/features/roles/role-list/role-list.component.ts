import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatestWith } from 'rxjs/internal/operators/combineLatestWith';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { SubSink } from 'subsink';
import { CreateRoleModalComponent } from '../create-role-modal/create-role-modal.component';
import { DeleteRoleModalComponent } from '../delete-role-modal/delete-role-modal.component';
import { RoleDto } from '../models/role-dto.model';
import { RoleService } from '../role.service';
import { ViewRoleModalComponent } from '../view-role-modal/view-role-modal.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
export class RoleListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean;
  roles: RoleDto[] = [];
  totalCount = 25;
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
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading = true;
    //this.filter.limit = this.filter.pageSize;
    //this.filter.offset = (this.filter.pageNo - 1) * this.filter.pageSize;
    var pagedAndSortedDto: PagedAndSortedDto = {
      pageNumber: this.filter.pageNumber,
      pageSize: this.filter.pageSize,
      sortBy: this.filter.sortBy,
      sortOrder:  this.filter.sortOrder,
      filter: '',
      userId: 0,
    };
    this.subs.sink = this.roleService
      .getAll(pagedAndSortedDto)
      .pipe(combineLatestWith(this.roleService.getCount()))
      .subscribe(([pagedResponse, countResponse]) => {
        this.isLoading = false;
        this.roles = pagedResponse.data;
        this.totalCount = countResponse.data.totalCount;

        console.log(pagedResponse);
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      });

    //this.subs.sink = this.roleService
    //  .getAll(pagedAndSortedDto)
    //  .subscribe((response: any) => {
    //    this.isLoading = false;
    //    this.roles = response.data;
    //    console.log(response);
    //    this.cdRef.detectChanges();
    //    MenuComponent.reinitialization();
    //  });
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
    modalRef.result.then(() => {
      this.load();
    });
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
