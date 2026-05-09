import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourierComponent } from './courier.component';
import { CourierProviderListComponent } from './courier-provider/courier-provider-list/courier-provider-list.component';
import { ViewCourierProviderModalComponent } from './courier-provider/view-courier-provider-modal/view-courier-provider-modal.component';
import { CourierStationListComponent } from './courier-station/courier-station-list/courier-station-list.component';
import { ViewCourierStationModalComponent } from './courier-station/view-courier-station-modal/view-courier-station-modal.component';
import { ViewCourierAreaMapModalComponent } from './courier-area-map/view-courier-area-map-modal/view-courier-area-map-modal.component';
import { CourierAreaMapListComponent } from './courier-area-map/courier-area-map-list/courier-area-map-list.component';

const routes: Routes = [
  {
    path: '',
    component: CourierComponent,
    children: [
      {
        path: 'courier-provider-list',
        component: CourierProviderListComponent,
      },
      {
        path: 'courier-provider-view',
        component: ViewCourierProviderModalComponent,
      },
      {
        path: 'courier-station-list',
        component: CourierStationListComponent,
      },
      {
        path: 'courier-station-view',
        component: ViewCourierStationModalComponent,
      },
      {
        path: 'courier-area-map-list',
        component: CourierAreaMapListComponent,
      },
      {
        path: 'courier-area-map-view',
        component: ViewCourierAreaMapModalComponent,
      },
      { path: '', redirectTo: 'couriers', pathMatch: 'full' },
      { path: '**', redirectTo: 'couriers', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourierRoutingModule { }
