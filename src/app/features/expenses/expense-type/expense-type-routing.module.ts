import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseTypeListComponent } from './expense-type-list/expense-type-list.component';
import { ExpenseTypeComponent } from './expense-type.component';
import { ViewExpenseTypeModalComponent } from './view-expense-type-modal/view-expense-type-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseTypeComponent,
    children: [
      {
        path: 'expense-type-list',
        component: ExpenseTypeListComponent,
      },
      {
        path: 'expense-type-view',
        component: ViewExpenseTypeModalComponent,
      },
      { path: '', redirectTo: 'expense-type-list', pathMatch: 'full' },
      { path: '**', redirectTo: 'expense-type-list', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseTypeRoutingModule { }
