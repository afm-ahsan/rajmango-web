import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubSink } from 'subsink';
import { UserDto } from '../models/user-dto.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-view-user-modal',
  templateUrl: './view-user-modal.component.html',
  styleUrls: ['./view-user-modal.component.scss'],
})
export class ViewUserModalComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @Input() roleName: string;
  subs = new SubSink();
  isLoading = false;
  userDto: UserDto = {} as UserDto;

  constructor(
    public modal: NgbActiveModal,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.isLoading = true;
    this.subs.sink = this.userService.getItem(this.id).subscribe(
      (userDto: any) => {
        this.userDto = userDto.data;
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