import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatestWith } from 'rxjs';
import { MenuComponent } from 'src/app/_metronic/kt/components';
import { FilterModel } from 'src/app/shared/models/filter.model';
import { PagedAndSortedDto } from 'src/app/shared/models/pagedAndSorted.model';
import { SubSink } from 'subsink';
import _ from 'underscore';
import { RoleDto } from '../../roles/models/role-dto.model';
import { RoleService } from '../../roles/role.service';
import { CreateUserModalComponent } from '../create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from '../delete-user-modal/delete-user-modal.component';
import { UserDto } from '../models/user-dto.model';
import { UserService } from '../user.service';
import { ViewUserModalComponent } from '../view-user-modal/view-user-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit, OnDestroy {
  subs = new SubSink();
  isLoading: boolean;
  users: UserDto[] = [];
  roles: RoleDto[] = [];
  totalCount = 10;
  filter: FilterModel = {
    offset: 0,
    limit: 0,
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'userName',
    sortOrder: 'asc',
    isDesc: false,
    userId: 0
  };

  constructor(
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private userService: UserService,
    private roleService: RoleService
  ) {}

  ngOnInit() {
    this.loadRole();
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

    this.subs.sink = this.userService
      .getAll(pagedAndSortedDto)
      .pipe(combineLatestWith(this.userService.getCount()))
      .subscribe(([pagedResponse, countResponse]) => {
        this.isLoading = false;
        this.users = pagedResponse.data;
        this.totalCount = countResponse.data.totalCount;

        console.log(pagedResponse);
        this.cdRef.detectChanges();
        MenuComponent.reinitialization();
      });
  }

  loadRole() {
    this.subs.sink = this.roleService
      .list()
      .subscribe((response: any) => {
        this.roles = response.data;
      });
  }

  getRoleName(id: number) {
    var role = _.find(this.roles, (item) => {
      return item.id == id;
    });
    if (role) {
      return role.name;
    }
  }

  create() {
    this.edit(0);
  }

  edit(id: number): void {
    const modalRef = this.modalService.open(CreateUserModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.roles = this.roles;
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
    const modalRef = this.modalService.open(DeleteUserModalComponent);
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

  view(id: number, roleId: number): void {
    const modalRef = this.modalService.open(ViewUserModalComponent, {
      size: 'md',
    });
    modalRef.componentInstance.id = id;
    modalRef.componentInstance.roleName = this.getRoleName(roleId);
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
