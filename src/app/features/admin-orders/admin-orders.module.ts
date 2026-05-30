import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminOrdersComponent } from './admin-orders.component';
import { AdminOrdersRoutingModule } from './admin-orders-routing.module';
import { AdminOrderListComponent } from './admin-order-list/admin-order-list.component';
import { AdminOrderViewModalComponent } from './admin-order-view-modal/admin-order-view-modal.component';
import { AdminOrderActionModalComponent } from './admin-order-action-modal/admin-order-action-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbModalModule,
    SharedModule,
    AdminOrdersRoutingModule,
  ],
  declarations: [
    AdminOrdersComponent,
    AdminOrderListComponent,
    AdminOrderViewModalComponent,
    AdminOrderActionModalComponent,
  ],
})
export class AdminOrdersModule {}
