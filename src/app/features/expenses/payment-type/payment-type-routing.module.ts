import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { PaymentTypeListComponent } from './payment-type-list/payment-type-list.component';
import { ViewPaymentTypeModalComponent } from './view-payment-type-modal/view-payment-type-modal.component';
import { PaymentTypeComponent } from './payment-type.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentTypeComponent,
    children: [
      {
        path: 'payment-method-list',
        component: PaymentTypeListComponent,
      },
      {
        path: 'payment-method-view',
        component: ViewPaymentTypeModalComponent,
      },
      { path: '', redirectTo: 'payment-methods', pathMatch: 'full' },
      { path: '**', redirectTo: 'payment-methods', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentTypeRoutingModule { }
