import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule

import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule

import { AppComponent } from './app.component';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { TransactionManagementComponent } from './components/transaction-management/transaction-management.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component'; // Import ConfirmationDialogComponent
import { CeilPipe } from './ceil.pipe';

@NgModule({
  declarations: [
    AppComponent,
    SummaryViewComponent,
    TransactionManagementComponent,
    ConfirmationDialogComponent, // Add ConfirmationDialogComponent here
    CeilPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule
    ReactiveFormsModule,
    BrowserAnimationsModule, // Add BrowserAnimationsModule
    MatDialogModule, // Add MatDialogModule
    ToastrModule.forRoot() // Configure ToastrModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent] // Add ConfirmationDialogComponent here
})
export class AppModule { }