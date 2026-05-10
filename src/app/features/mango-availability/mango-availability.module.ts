import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MangoAvailabilityServiceProxy, MangoTypeServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { MangoAvailabilityComponent } from './mango-availability.component';
import { MangoAvailabilityRoutingModule } from './mango-availability-routing.module';
import { AvailabilityListComponent } from './availability-list/availability-list.component';
import { AvailabilityModalComponent } from './availability-modal/availability-modal.component';

@NgModule({
  declarations: [
    MangoAvailabilityComponent,
    AvailabilityListComponent,
    AvailabilityModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    InlineSVGModule,
    SharedModule,
    MangoAvailabilityRoutingModule,
  ],
  providers: [MangoAvailabilityServiceProxy, MangoTypeServiceProxy],
})
export class MangoAvailabilityModule {}
