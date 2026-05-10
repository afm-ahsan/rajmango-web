import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminComplaintListComponent } from './admin-complaint-list/admin-complaint-list.component';
import { ComplaintComponent } from './complaint.component';
import { ComplaintRoutingModule } from './complaint-routing.module';
import { MyComplaintsComponent } from './my-complaints/my-complaints.component';
import { UpdateStatusModalComponent } from './update-status-modal/update-status-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    SharedModule,
    ComplaintRoutingModule,
  ],
  declarations: [
    ComplaintComponent,
    AdminComplaintListComponent,
    MyComplaintsComponent,
    UpdateStatusModalComponent,
  ],
})
export class ComplaintModule {}
