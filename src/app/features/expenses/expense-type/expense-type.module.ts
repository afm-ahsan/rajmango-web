import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateExpenseTypeModalComponent } from './create-expense-type-modal/create-expense-type-modal.component';
import { DeleteExpenseTypeModalComponent } from './delete-expense-type-modal/delete-expense-type-modal.component';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { ExpenseTypeRoutingModule } from './expense-type-routing.module';
import { ExpenseTypeComponent } from './expense-type.component';
import { ViewExpenseTypeModalComponent } from './view-expense-type-modal/view-expense-type-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    ExpenseTypeRoutingModule,
  ],
  declarations: [
    ExpenseTypeComponent,
    CreateExpenseTypeModalComponent,
    DeleteExpenseTypeModalComponent,
    ViewExpenseTypeModalComponent,
    ExpenseTypeListComponent,
  ]
})
export class ExpenseTypeModule { }
