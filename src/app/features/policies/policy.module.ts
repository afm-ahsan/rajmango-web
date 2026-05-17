import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminPolicyListComponent } from './admin-policy-list/admin-policy-list.component';
import { PolicyDetailComponent } from './policy-detail/policy-detail.component';
import { PolicyComponent } from './policy.component';
import { PolicyRoutingModule } from './policy-routing.module';
import { PolicyViewComponent } from './policy-view/policy-view.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    PolicyRoutingModule,
  ],
  declarations: [
    PolicyComponent,
    AdminPolicyListComponent,
    PolicyViewComponent,
    PolicyDetailComponent,
  ],
})
export class PolicyModule {}
