import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { FeedbackListComponent } from './feedback-list/feedback-list.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackComponent,
    children: [
      { path: 'feedback-list', component: FeedbackListComponent },
      { path: '', redirectTo: 'feedback-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRoutingModule {}
