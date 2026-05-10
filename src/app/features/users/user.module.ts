import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { UserServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateUserModalComponent } from './create-user-modal/create-user-modal.component';
import { DeleteUserModalComponent } from './delete-user-modal/delete-user-modal.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ViewUserModalComponent } from './view-user-modal/view-user-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    UserRoutingModule,
  ],
  declarations: [
    UserComponent,
    CreateUserModalComponent,
    DeleteUserModalComponent,
    ViewUserModalComponent,
    UserListComponent,
  ],
  providers: [UserServiceProxy],
})
export class UserModule { }
