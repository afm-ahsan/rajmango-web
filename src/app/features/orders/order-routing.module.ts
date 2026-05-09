import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderComponent } from './order.component';
import { ViewOrderModalComponent } from './view-order-modal/view-order-modal.component';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'order-list',
        component: OrderListComponent,
      },
      {
        path: 'order-view',
        component: ViewOrderModalComponent,
      },
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      { path: '**', redirectTo: 'orders', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
