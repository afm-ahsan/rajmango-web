import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardServiceProxy, MangoAvailabilityServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CustomerDashboardComponent,
    AdminDashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModalModule,
    SharedModule,
    DashboardRoutingModule,
  ],
  providers: [DashboardServiceProxy, MangoAvailabilityServiceProxy],
})
export class DashboardModule {}
