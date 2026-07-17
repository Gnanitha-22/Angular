import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.open(message, 'Success', 'snackbar-success');
  }

  error(message: string): void {
    this.open(message, 'Error', 'snackbar-error');
  }

  warning(message: string): void {
    this.open(message, 'Warning', 'snackbar-warn');
  }

  info(message: string): void {
    this.open(message, 'Info', 'snackbar-info');
  }

  private open(message: string, action: string, panelClass: string): void {
    this.snackBar.open(message, action, {
      duration: 4500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }
}
