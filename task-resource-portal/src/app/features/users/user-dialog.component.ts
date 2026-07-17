import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../models';
import { ValidationMessagesComponent } from '../../shared/components/validation-messages/validation-messages.component';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ValidationMessagesComponent
  ],
  template: `
    <div mat-dialog-container class="dialog-container">
      <h2 mat-dialog-title>{{ data ? 'Edit User' : 'Add New User' }}</h2>
      
      <form [formGroup]="form" class="user-form">
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter full name" />
          <mat-error *ngIf="form.get('name')?.hasError('required')">Name is required</mat-error>
          <mat-error *ngIf="form.get('name')?.hasError('minlength')">Name must be at least 2 characters</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email" placeholder="Enter email address" />
          <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="form.get('email')?.hasError('email')">Please enter a valid email</mat-error>
          <app-validation-messages [control]="form.get('email')"></app-validation-messages>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="Admin">Admin</mat-option>
            <mat-option value="Project Manager">Project Manager</mat-option>
            <mat-option value="Team Member">Team Member</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('role')?.hasError('required')">Role is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Department</mat-label>
          <mat-select formControlName="department">
            <mat-option value="Engineering">Engineering</mat-option>
            <mat-option value="Design">Design</mat-option>
            <mat-option value="Product">Product</mat-option>
            <mat-option value="Finance">Finance</mat-option>
            <mat-option value="Operations">Operations</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('department')?.hasError('required')">Department is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
            <mat-option value="On Leave">On Leave</mat-option>
          </mat-select>
          <mat-error *ngIf="form.get('status')?.hasError('required')">Status is required</mat-error>
        </mat-form-field>
      </form>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid">
          {{ data ? 'Update' : 'Create' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
      padding: 20px;
    }

    h2 {
      margin: 0 0 20px 0;
      font-size: 20px;
      font-weight: 600;
      color: #0f172a;
    }

    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 20px;
    }

    .form-field {
      width: 100%;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
    }

    mat-error {
      font-size: 12px;
    }
  `]
})
export class UserDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      department: ['', Validators.required],
      status: ['Active', Validators.required]
    });

    if (data) {
      this.form.patchValue(data);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
