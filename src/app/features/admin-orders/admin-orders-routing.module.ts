import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOrdersComponent } from './admin-orders.component';
import { AdminOrderListComponent } from './admin-order-list/admin-order-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminOrdersComponent,
    children: [
      { path: 'list', component: AdminOrderListComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminOrdersRoutingModule {}
