import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateMangoTypeModalComponent } from './create-mango-type-modal/create-mango-type-modal.component';
import { DeleteMangoTypeModalComponent } from './delete-mango-type-modal/delete-mango-type-modal.component';
import { MangoTypeListComponent } from './mango-type-list/mango-type-list.component';
import { MangoTypeRoutingModule } from './mango-type-routing.module';
import { MangoTypeComponent } from './mango-type.component';
import { ViewMangoTypeModalComponent } from './view-mango-type-modal/view-mango-type-modal.component';

@NgModule({
  declarations: [
    MangoTypeComponent,
    MangoTypeListComponent,
    CreateMangoTypeModalComponent,
    DeleteMangoTypeModalComponent,
    ViewMangoTypeModalComponent
  ],
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    MangoTypeRoutingModule,
  ]
})
export class MangoTypeModule { }
