import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateOrderModalComponent } from './create-order-modal/create-order-modal.component';
import { DeleteOrderModalComponent } from './delete-order-modal/delete-order-modal.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order.component';
import { ViewOrderModalComponent } from './view-order-modal/view-order-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    OrderRoutingModule,
  ],
  declarations: [
    OrderComponent,
    CreateOrderModalComponent,
    DeleteOrderModalComponent,
    ViewOrderModalComponent,
    OrderListComponent,
  ]
})
export class OrderModule { }
