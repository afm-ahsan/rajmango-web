import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateExpenseModalComponent } from './create-expense-modal/create-expense-modal.component';
import { DeleteExpenseModalComponent } from './delete-expense-modal/delete-expense-modal.component';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseRoutingModule } from './expense-routing.module';
import { ExpenseComponent } from './expense.component';
import { ViewExpenseModalComponent } from './view-expense-modal/view-expense-modal.component';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    InlineSVGModule,
    SharedModule,
    ExpenseRoutingModule,
  ],
  declarations: [
    ExpenseComponent,
    CreateExpenseModalComponent,
    DeleteExpenseModalComponent,
    ViewExpenseModalComponent,
    ExpenseListComponent,
  ]
})
export class ExpenseModule { }
