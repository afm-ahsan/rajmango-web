import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MangoCatalogComponent } from './mango-catalog.component';
import { CatalogListComponent } from './catalog-list/catalog-list.component';

const routes: Routes = [
  {
    path: '',
    component: MangoCatalogComponent,
    children: [
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
      { path: 'catalog', component: CatalogListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MangoCatalogRoutingModule {}
