import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentListComponent } from './payment-list/payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      { path: 'payment-list', component: PaymentListComponent },
      { path: '', redirectTo: 'payment-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
