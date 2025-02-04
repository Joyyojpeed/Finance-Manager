import { Component, OnInit } from '@angular/core';
import { TransactionService } from '../../transaction.service';

@Component({
  selector: 'app-summary-view',
  templateUrl: './summary-view.component.html',
  styleUrls: ['./summary-view.component.scss']
})
export class SummaryViewComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  balance: number = 0;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Fetch summary immediately on component load
    const summary = this.transactionService.getSummary();
    this.totalIncome = summary.totalIncome;
    this.totalExpenses = summary.totalExpenses;
    this.balance = summary.balance;
  
    // Subscribe to future updates
    this.transactionService.transactions$.subscribe(() => {
      const updatedSummary = this.transactionService.getSummary();
      this.totalIncome = updatedSummary.totalIncome;
      this.totalExpenses = updatedSummary.totalExpenses;
      this.balance = updatedSummary.balance;
    });
  }
}