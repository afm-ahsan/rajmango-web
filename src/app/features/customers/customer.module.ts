import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateCustomerModalComponent } from './create-customer-modal/create-customer-modal.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { DeleteCustomerModalComponent } from './delete-customer-modal/delete-customer-modal.component';
import { ViewCustomerModalComponent } from './view-customer-modal/view-customer-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    CustomerRoutingModule,
  ],
  declarations: [
    CustomerComponent,
    CreateCustomerModalComponent,
    DeleteCustomerModalComponent,
    ViewCustomerModalComponent,
    CustomerListComponent,
  ]
})
export class CustomerModule { }
