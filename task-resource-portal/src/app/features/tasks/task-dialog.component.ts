import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../models';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>{{ data ? 'Edit Task' : 'Add New Task' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="taskForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Task Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter task name">
            <mat-error *ngIf="taskForm.get('name')?.hasError('required')">
              Task name is required
            </mat-error>
            <mat-error *ngIf="taskForm.get('name')?.hasError('minlength')">
              Minimum 3 characters required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Task description" rows="3"></textarea>
            <mat-error *ngIf="taskForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Assigned User</mat-label>
            <mat-select formControlName="assignedUser">
              <mat-option value="John Anderson">John Anderson</mat-option>
              <mat-option value="Sarah Chen">Sarah Chen</mat-option>
              <mat-option value="Emily Thompson">Emily Thompson</mat-option>
              <mat-option value="Michael Rodriguez">Michael Rodriguez</mat-option>
              <mat-option value="David Kim">David Kim</mat-option>
              <mat-option value="Lisa Martinez">Lisa Martinez</mat-option>
              <mat-option value="James Wilson">James Wilson</mat-option>
              <mat-option value="Jessica Lee">Jessica Lee</mat-option>
            </mat-select>
            <mat-error *ngIf="taskForm.get('assignedUser')?.hasError('required')">
              Assigned user is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="Low">Low</mat-option>
              <mat-option value="Medium">Medium</mat-option>
              <mat-option value="High">High</mat-option>
              <mat-option value="Critical">Critical</mat-option>
            </mat-select>
            <mat-error *ngIf="taskForm.get('priority')?.hasError('required')">
              Priority is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Due Date</mat-label>
            <input matInput type="date" formControlName="dueDate">
            <mat-error *ngIf="taskForm.get('dueDate')?.hasError('required')">
              Due date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="To Do">To Do</mat-option>
              <mat-option value="In Progress">In Progress</mat-option>
              <mat-option value="In Review">In Review</mat-option>
              <mat-option value="Done">Done</mat-option>
              <mat-option value="Blocked">Blocked</mat-option>
            </mat-select>
            <mat-error *ngIf="taskForm.get('status')?.hasError('required')">
              Status is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!taskForm.valid">
          {{ data ? 'Update Task' : 'Create Task' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 450px;
      padding: 20px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    mat-form-field {
      display: block;
    }

    textarea {
      font-family: Roboto, sans-serif;
      resize: none;
    }

    mat-dialog-actions {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    button {
      margin-left: 8px;
    }
  `]
})
export class TaskDialogComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      assignedUser: ['', Validators.required],
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.taskForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
