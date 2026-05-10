import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComplaintListComponent } from './admin-complaint-list/admin-complaint-list.component';
import { ComplaintComponent } from './complaint.component';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';

const routes: Routes = [
  {
    path: '',
    component: ComplaintComponent,
    children: [
      { path: 'all', component: AdminComplaintListComponent },
      { path: 'mine', component: MyComplaintsComponent },
      { path: '', redirectTo: 'mine', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplaintRoutingModule {}
