import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { TransactionManagementComponent } from './components/transaction-management/transaction-management.component';

const routes: Routes = [
  { path: '', component: SummaryViewComponent },
  { path: 'manage-transactions', component: TransactionManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
