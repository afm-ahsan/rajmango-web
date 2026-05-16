import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangoTypeListComponent } from './mango-type-list/mango-type-list.component';
import { MangoTypeComponent } from './mango-type.component';
import { ViewMangoTypeModalComponent } from './view-mango-type-modal/view-mango-type-modal.component';

const routes: Routes = [
  {
    path: '',
    component: MangoTypeComponent,
    children: [
      {
        path: 'mango-type-list',
        component: MangoTypeListComponent,
      },
      {
        path: 'mango-type-view',
        component: ViewMangoTypeModalComponent,
      },
      { path: '', redirectTo: 'mango-type-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'mango-type-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangoTypeRoutingModule { }
