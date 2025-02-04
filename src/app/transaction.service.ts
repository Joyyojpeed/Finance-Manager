import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactions: Transaction[] = this.loadTransactions();
  private transactionsSubject = new BehaviorSubject<Transaction[]>(this.transactions);
  transactions$ = this.transactionsSubject.asObservable();

  private loadTransactions(): Transaction[] {
    const data = localStorage.getItem('transactions');
    return data ? JSON.parse(data) : [];
  }

  private saveTransactions(): void {
    localStorage.setItem('transactions', JSON.stringify(this.transactions));
  }

  getTransactions(): Transaction[] {
    return this.transactions;
  }

  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions);
  }

  editTransaction(updatedTransaction: Transaction): void {
    console.log(updatedTransaction)
    const index = this.transactions.findIndex(t => t.id === updatedTransaction.id);
    if (index !== -1) {
      this.transactions[index] = updatedTransaction;
      this.saveTransactions();
      this.transactionsSubject.next(this.transactions);
    }
  }

  deleteTransaction(id: string): void {
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    this.saveTransactions();
    this.transactionsSubject.next(this.transactions);
  }

  getSummary() {
    const totalIncome = this.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = this.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }
}
