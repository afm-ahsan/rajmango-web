import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleComponent } from './role.component';
import { ViewRoleModalComponent } from './view-role-modal/view-role-modal.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent,
    children: [
      {
        path: 'role-list',
        component: RoleListComponent,
      },
      {
        path: 'role-view',
        component: ViewRoleModalComponent,
      },
      { path: '', redirectTo: 'role-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'role-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule { }
