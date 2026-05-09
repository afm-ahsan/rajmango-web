import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateRoleModalComponent } from './create-role-modal/create-role-modal.component';
import { DeleteRoleModalComponent } from './delete-role-modal/delete-role-modal.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleRoutingModule } from './role-routing.module';
import { RoleComponent } from './role.component';
import { ViewRoleModalComponent } from './view-role-modal/view-role-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    RoleRoutingModule,
  ],
  declarations: [
    RoleComponent,
    CreateRoleModalComponent,
    DeleteRoleModalComponent,
    ViewRoleModalComponent,
    RoleListComponent,
  ]
})
export class RoleModule { }
