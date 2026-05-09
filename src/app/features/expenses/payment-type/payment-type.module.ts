import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreatePaymentTypeModalComponent } from './create-payment-type-modal/create-payment-type-modal.component';
import { DeletePaymentTypeModalComponent } from './delete-payment-type-modal/delete-payment-type-modal.component';
import { PaymentTypeListComponent } from './payment-type-list/payment-type-list.component';
import { PaymentTypeRoutingModule } from './payment-type-routing.module';
import { PaymentTypeComponent } from './payment-type.component';
import { ViewPaymentTypeModalComponent } from './view-payment-type-modal/view-payment-type-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    PaymentTypeRoutingModule,
  ],
  declarations: [
    PaymentTypeComponent,
    CreatePaymentTypeModalComponent,
    DeletePaymentTypeModalComponent,
    ViewPaymentTypeModalComponent,
    PaymentTypeListComponent,
  ]
})
export class PaymentTypeModule { }
