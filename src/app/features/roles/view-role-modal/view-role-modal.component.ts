import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { RoleDto } from '../models/role-dto.model';
import { RoleService } from '../role.service';

@Component({
  selector: 'app-view-role-modal',
  templateUrl: './view-role-modal.component.html',
  styleUrls: ['./view-role-modal.component.scss'],
})
export class ViewRoleModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  subs = new SubSink();
  isLoading = false;
  roleDto: RoleDto = {} as RoleDto;

  constructor(
    public modal: NgbActiveModal,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.loadRole();
  }

  loadRole() {
    this.isLoading = true;
    this.subs.sink = this.roleService.getItem(this.id).subscribe(
      (roleDto: any) => {
        this.roleDto = roleDto.data;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.modal.dismiss();
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
