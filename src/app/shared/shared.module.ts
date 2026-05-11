import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { DataLoadingEmptyComponent } from './components/data-loading-empty/data-loading-empty.component';
import { DownloadComponent } from './components/download/download.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaymentModalComponent } from './components/payment-modal/payment-modal.component';
import { PrintModalComponent } from './components/print-modal/print-modal.component';
import { SingleFileUploadComponent } from './components/single-file-upload/single-file-upload.component';
import { UploadComponent } from './components/upload/upload.component';
import { CheckChildrenDirective } from './directives/check-children.directive';
import { SelectGroupDirective } from './directives/select-group.directive';
import { TreePipe } from './pipes/tree.pipe';
//import { NgxSpinnerModule } from "ngx-spinner";
import { RouterModule } from '@angular/router';
import { NgxPrintModule } from 'ngx-print';
import { AppDataEmptyComponent } from './components/app-data-empty/app-data-empty.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MangoCardComponent } from './components/mango-card/mango-card.component';
import { MangoDetailModalComponent } from './components/mango-detail-modal/mango-detail-modal.component';
import { QuickOrderModalComponent } from './components/quick-order-modal/quick-order-modal.component';
import { SortableHeaderComponent } from './components/sortable-header/sortable-header.component';
import { PermissionDirective } from './directives/permission.directive';
import { YesNoPipe } from './pipes/yes-no.pipe';
import { SubmitFeedbackModalComponent } from '../features/feedback/submit-feedback-modal/submit-feedback-modal.component';
import { SubmitComplaintModalComponent } from '../features/complaints/submit-complaint-modal/submit-complaint-modal.component';
import { MultiUploadComponent } from './components/multi-upload/multi-upload.component';
import { CreateOrderModalComponent } from '../features/orders/create-order-modal/create-order-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InlineSVGModule,
    NgxPrintModule,
    RouterModule, 
  ],
  declarations: [
    TreePipe,
    YesNoPipe,
    LoaderComponent,
    UploadComponent,
    DownloadComponent,
    PaginationComponent,
    AlertModalComponent,
    SelectGroupDirective,
    PaymentModalComponent,
    ConfirmModalComponent,
    CheckChildrenDirective,
    DataLoadingEmptyComponent,
    SingleFileUploadComponent,
    PrintModalComponent,
    SortableHeaderComponent,
    MangoCardComponent,
    MangoDetailModalComponent,
    QuickOrderModalComponent,
    AppDataEmptyComponent,
    PermissionDirective,
    SubmitFeedbackModalComponent,
    SubmitComplaintModalComponent,
    MultiUploadComponent,
    CreateOrderModalComponent,
  ],
  exports: [
    TreePipe,
    YesNoPipe,
    LoaderComponent,
    UploadComponent,
    DownloadComponent,
    PaginationComponent,
    SelectGroupDirective,
    PaymentModalComponent,
    CheckChildrenDirective,
    DataLoadingEmptyComponent,
    SingleFileUploadComponent,
    PrintModalComponent,
    SortableHeaderComponent,    
    MangoCardComponent,
    MangoDetailModalComponent,
    AppDataEmptyComponent,
    PermissionDirective,
    SubmitFeedbackModalComponent,
    SubmitComplaintModalComponent,
    MultiUploadComponent,
  ],
})
export class SharedModule {}
