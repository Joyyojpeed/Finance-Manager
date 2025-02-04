import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransactionService, Transaction } from '../../transaction.service';
import { v4 as uuidv4 } from 'uuid';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-transaction-management',
  templateUrl: './transaction-management.component.html',
  styleUrls: ['./transaction-management.component.scss'],
  animations: [
    trigger('pageTransition', [
      transition(':increment', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':decrement', [
        style({ opacity: 0, transform: 'translateX(-50px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))
      ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class TransactionManagementComponent implements OnInit {
  transactions: Transaction[] = [];
  paginatedTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  transactionToEdit: Transaction | null = null;
  transactionForm: FormGroup;
  error: string = '';
  isDarkMode: boolean = true;

  categories = ['Groceries', 'Rent', 'Salary', 'Entertainment'];

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;

  // Search and Date Filter
  searchQuery: string = '';
  startDate: string = '';
  endDate: string = '';

  // Loading State
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private dialog: MatDialog,
    private toastr: ToastrService
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
      this.applyFilters();
    });
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            (transaction.category && transaction.category.toLowerCase().includes(this.searchQuery.toLowerCase()));

      const transactionDate = new Date(transaction.date);
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;

      const matchesDate = (!start || transactionDate >= start) &&
                          (!end || transactionDate <= end);

      return matchesSearch && matchesDate;
    });

    this.totalPages = Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
    this.paginateTransactions();
  }

  paginateTransactions(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedTransactions = this.filteredTransactions.slice(startIndex, endIndex);
  }

  saveTransaction(): void {
    if (this.transactionForm.valid) {
      this.error = '';
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
        this.toastr.success('Transaction updated successfully!', '', {
          toastClass: 'toast-success',
        });
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
        this.toastr.success('Transaction added successfully!', '', {
          toastClass: 'toast-success',
        });
      }

      this.resetForm();
    } else {
      this.toastr.error('Please fill in all the details.', '', {
        toastClass: 'toast-error',
      });
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.transactionService.deleteTransaction(id);
        this.toastr.error('Transaction deleted successfully!', '', {
          toastClass: 'toast-error',
        });
      }
    });
  }

  // Pagination Controls
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loading = true;
      setTimeout(() => {
        this.currentPage++;
        this.paginateTransactions();
        this.loading = false;
      }, 0);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loading = true;
      setTimeout(() => {
        this.currentPage--;
        this.paginateTransactions();
        this.loading = false;
      }, 0);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loading = true;
      setTimeout(() => {
        this.currentPage = page;
        this.paginateTransactions();
        this.loading = false;
      }, 0);
    }
  }
}

// node --openssl-legacy-provider node_modules/@angular/cli/bin/ng serve
