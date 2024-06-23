import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../transaction.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html'
})
export class SummaryViewComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(() => {
      const summary = this.transactionService.getSummary();
      this.totalIncome = summary.totalIncome;
      this.totalExpenses = summary.totalExpenses;
      this.balance = summary.balance;
    });


    
  }
}
