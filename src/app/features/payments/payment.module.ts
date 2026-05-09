import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PaymentServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { RecordPaymentModalComponent } from './record-payment-modal/record-payment-modal.component';
import { ViewPaymentModalComponent } from './view-payment-modal/view-payment-modal.component';

@NgModule({
  declarations: [
    PaymentComponent,
    PaymentListComponent,
    RecordPaymentModalComponent,
    ViewPaymentModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    InlineSVGModule,
    SharedModule,
    PaymentRoutingModule,
  ],
  providers: [PaymentServiceProxy],
})
export class PaymentModule {}
