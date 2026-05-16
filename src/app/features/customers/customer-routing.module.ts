import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerComponent } from './customer.component';
import { ViewCustomerModalComponent } from './view-customer-modal/view-customer-modal.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: 'customer-list',
        component: CustomerListComponent,
      },
      {
        path: 'customer-view',
        component: ViewCustomerModalComponent,
      },
      { path: '', redirectTo: 'customer-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'customer-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule { }
