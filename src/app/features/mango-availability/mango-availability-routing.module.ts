import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangoAvailabilityComponent } from './mango-availability.component';
import { AvailabilityListComponent } from './availability-list/availability-list.component';

const routes: Routes = [
  {
    path: '',
    component: MangoAvailabilityComponent,
    children: [
      { path: 'availability-list', component: AvailabilityListComponent },
      { path: '', redirectTo: 'availability-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangoAvailabilityRoutingModule {}
