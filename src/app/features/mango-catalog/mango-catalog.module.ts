import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MangoAvailabilityServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogListComponent } from './catalog-list/catalog-list.component';
import { MangoCatalogRoutingModule } from './mango-catalog-routing.module';
import { MangoCatalogComponent } from './mango-catalog.component';

@NgModule({
  declarations: [MangoCatalogComponent, CatalogListComponent],
  imports: [CommonModule, NgbModalModule, InlineSVGModule, SharedModule, MangoCatalogRoutingModule],
  providers: [MangoAvailabilityServiceProxy],
})
export class MangoCatalogModule {}
