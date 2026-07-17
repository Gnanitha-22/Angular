import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Project } from '../../models';

@Component({
  selector: 'app-project-dialog',
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
      <h2 mat-dialog-title>{{ data ? 'Edit Project' : 'Add New Project' }}</h2>
      <mat-dialog-content>
        <form [formGroup]="projectForm">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Project Name</mat-label>
            <input matInput formControlName="name" placeholder="Enter project name">
            <mat-error *ngIf="projectForm.get('name')?.hasError('required')">
              Project name is required
            </mat-error>
            <mat-error *ngIf="projectForm.get('name')?.hasError('minlength')">
              Minimum 3 characters required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Project Code</mat-label>
            <input matInput formControlName="code" placeholder="e.g., PROJ-001">
            <mat-error *ngIf="projectForm.get('code')?.hasError('required')">
              Project code is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" placeholder="Project description" rows="3"></textarea>
            <mat-error *ngIf="projectForm.get('description')?.hasError('required')">
              Description is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Start Date</mat-label>
            <input matInput type="date" formControlName="startDate">
            <mat-error *ngIf="projectForm.get('startDate')?.hasError('required')">
              Start date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>End Date</mat-label>
            <input matInput type="date" formControlName="endDate">
            <mat-error *ngIf="projectForm.get('endDate')?.hasError('required')">
              End date is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Project Manager</mat-label>
            <mat-select formControlName="manager">
              <mat-option value="Sarah Chen">Sarah Chen</mat-option>
              <mat-option value="James Wilson">James Wilson</mat-option>
              <mat-option value="Emily Thompson">Emily Thompson</mat-option>
              <mat-option value="Michael Rodriguez">Michael Rodriguez</mat-option>
              <mat-option value="David Kim">David Kim</mat-option>
              <mat-option value="Lisa Martinez">Lisa Martinez</mat-option>
            </mat-select>
            <mat-error *ngIf="projectForm.get('manager')?.hasError('required')">
              Project manager is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="Planning">Planning</mat-option>
              <mat-option value="In Progress">In Progress</mat-option>
              <mat-option value="On Hold">On Hold</mat-option>
              <mat-option value="Completed">Completed</mat-option>
              <mat-option value="Cancelled">Cancelled</mat-option>
            </mat-select>
            <mat-error *ngIf="projectForm.get('status')?.hasError('required')">
              Status is required
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
            <mat-error *ngIf="projectForm.get('priority')?.hasError('required')">
              Priority is required
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Budget</mat-label>
            <input matInput type="number" formControlName="budget" placeholder="Enter budget amount">
            <mat-error *ngIf="projectForm.get('budget')?.hasError('required')">
              Budget is required
            </mat-error>
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!projectForm.valid">
          {{ data ? 'Update Project' : 'Create Project' }}
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
export class ProjectDialogComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project | null
  ) {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      code: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      manager: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.projectForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.dialogRef.close(this.projectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
