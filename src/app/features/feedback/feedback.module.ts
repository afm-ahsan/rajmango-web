import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { FeedbackComponent } from './feedback.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';
import { FeedbackRoutingModule } from './feedback-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    SharedModule,
    FeedbackRoutingModule,
  ],
  declarations: [
    FeedbackComponent,
    FeedbackListComponent,
  ],
})
export class FeedbackModule {}
