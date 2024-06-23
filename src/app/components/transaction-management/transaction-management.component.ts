import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../../transaction.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-transaction-management',
  templateUrl: './transaction-management.component.html'
})
export class TransactionManagementComponent implements OnInit {
  transactions: Transaction[] = [];
  transactionToEdit: Transaction | null = null;
  transactionForm: FormGroup; // Define the FormGroup for reactive forms

  categories = ['Groceries', 'Rent', 'Salary', 'Entertainment'];
  error: string='';

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService
  ) {
    this.transactionForm = this.fb.group({
      description: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      type: ['income', Validators.required],
      category: [this.categories[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
    });
  }

  saveTransaction(): void {
    if (this.transactionForm.valid) {
      this.error='';
      const formValues = this.transactionForm.value;
      if (this.transactionToEdit) {
        const updatedTransaction: Transaction = {
          ...this.transactionToEdit,
          description: formValues.description,
          amount: formValues.amount,
          date: formValues.date,
          type: formValues.type,
          category: formValues.category
        };
        this.transactionService.editTransaction(updatedTransaction);
      } else {
        const newTransaction: Transaction = {
          id: uuidv4(),
          description: formValues.description,
          amount: formValues.amount,
          date: formValues.date,
          type: formValues.type,
          category: formValues.category
        };
        this.transactionService.addTransaction(newTransaction);
      }
      this.resetForm();
    } else {
      console.log("Form is invalid. Cannot submit.");
      this.error = "Fill in all the details"
    }
  }

  resetForm(): void {
    this.transactionForm.reset({
      type: 'income',
      category: this.categories[0]
    });
    this.transactionToEdit = null;
  }

  startEditTransaction(transaction: Transaction): void {
    this.transactionToEdit = transaction;
    this.transactionForm.patchValue({
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category: transaction.category || this.categories[0]
    });
  }

  deleteTransaction(id: string): void {
    this.transactionService.deleteTransaction(id);
  }
}
