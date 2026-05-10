import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPolicyListComponent } from './admin-policy-list/admin-policy-list.component';
import { PolicyComponent } from './policy.component';
import { PolicyViewComponent } from './policy-view/policy-view.component';

const routes: Routes = [
  {
    path: '',
    component: PolicyComponent,
    children: [
      { path: 'manage', component: AdminPolicyListComponent },
      { path: 'view', component: PolicyViewComponent },
      { path: '', redirectTo: 'view', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule {}
