import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListComponent } from './expense-list/expense-list.component';
import { ExpenseComponent } from './expense.component';
import { ViewExpenseModalComponent } from './view-expense-modal/view-expense-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseComponent,
    children: [
      {
        path: 'expense-list',
        component: ExpenseListComponent,
      },
      {
        path: 'expense-view',
        component: ViewExpenseModalComponent,
      },
      { path: '', redirectTo: 'expense-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'expense-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseRoutingModule { }
