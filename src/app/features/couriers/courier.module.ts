import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CourierAreaMapListComponent } from './courier-area-map/courier-area-map-list/courier-area-map-list.component';
import { CreatCourierAreaMapModalComponent } from './courier-area-map/creat-courier-area-map-modal/creat-courier-area-map-modal.component';
import { DeleteCourierAreaMapModalComponent } from './courier-area-map/delete-courier-area-map-modal/delete-courier-area-map-modal.component';
import { ViewCourierAreaMapModalComponent } from './courier-area-map/view-courier-area-map-modal/view-courier-area-map-modal.component';
import { CourierProviderListComponent } from './courier-provider/courier-provider-list/courier-provider-list.component';
import { CreateCourierProviderModalComponent } from './courier-provider/create-courier-provider-modal/create-courier-provider-modal.component';
import { DeleteCourierProviderModalComponent } from './courier-provider/delete-courier-provider-modal/delete-courier-provider-modal.component';
import { ViewCourierProviderModalComponent } from './courier-provider/view-courier-provider-modal/view-courier-provider-modal.component';
import { CourierRoutingModule } from './courier-routing.module';
import { CourierStationListComponent } from './courier-station/courier-station-list/courier-station-list.component';
import { CreateCourierStationModalComponent } from './courier-station/create-courier-station-modal/create-courier-station-modal.component';
import { DeleteCourierStationModalComponent } from './courier-station/delete-courier-station-modal/delete-courier-station-modal.component';
import { ViewCourierStationModalComponent } from './courier-station/view-courier-station-modal/view-courier-station-modal.component';
import { CourierComponent } from './courier.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    CourierRoutingModule,
  ],
  declarations: [
    CourierComponent,
    CreateCourierProviderModalComponent,
    DeleteCourierProviderModalComponent,
    ViewCourierProviderModalComponent,
    CourierProviderListComponent,
    CreateCourierStationModalComponent,
    ViewCourierStationModalComponent,
    DeleteCourierStationModalComponent,
    CourierStationListComponent,
    CreatCourierAreaMapModalComponent,
    ViewCourierAreaMapModalComponent,
    DeleteCourierAreaMapModalComponent,
    CourierAreaMapListComponent,
  ]
})
export class CourierModule { }
