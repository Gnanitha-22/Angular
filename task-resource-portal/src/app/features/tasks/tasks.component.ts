import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Task } from '../../models';
import { TaskService } from '../../core/services/task.service';
import { TaskDialogComponent } from './task-dialog.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    RouterModule
  ],
  template: `
    <div class="tasks-container">
      <div class="tasks-header">
        <h1>Tasks Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          ➕ Add New Task
        </button>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Search by task name or description...">
          <span matSuffix class="field-icon">🔍</span>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status Filter</mat-label>
          <mat-select [formControl]="statusFilterControl">
            <mat-option value="">All Status</mat-option>
            <mat-option value="To Do">To Do</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="In Review">In Review</mat-option>
            <mat-option value="Done">Done</mat-option>
            <mat-option value="Blocked">Blocked</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Priority Filter</mat-label>
          <mat-select [formControl]="priorityFilterControl">
            <mat-option value="">All Priorities</mat-option>
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
            <mat-option value="Critical">Critical</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort class="tasks-table">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Task Name</th>
            <td mat-cell *matCellDef="let element">
              <div class="name-cell">
                <div class="task-name">{{ element.name }}</div>
                <div class="task-desc">{{ element.description }}</div>
              </div>
            </td>
          </ng-container>

          <!-- Assigned User Column -->
          <ng-container matColumnDef="assignedUser">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Assigned User</th>
            <td mat-cell *matCellDef="let element">{{ element.assignedUser }}</td>
          </ng-container>

          <!-- Priority Column -->
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
            <td mat-cell *matCellDef="let element">
              <span class="priority-badge" [ngClass]="getPriorityClass(element.priority)">
                {{ element.priority }}
              </span>
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let element">
              <span class="status-badge" [ngClass]="getStatusClass(element.status)">
                {{ element.status }}
              </span>
            </td>
          </ng-container>

          <!-- Due Date Column -->
          <ng-container matColumnDef="dueDate">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Due Date</th>
            <td mat-cell *matCellDef="let element">
              {{ element.dueDate | date: 'MMM d, yyyy' }}
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <div class="action-buttons">
                <button mat-stroked-button color="primary" class="edit-btn" (click)="openEditDialog(element)" title="Edit">
                  Edit
                </button>
                <button mat-stroked-button color="warn" class="delete-btn" (click)="deleteTask(element.id)" title="Delete">
                  Delete
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="task-row"></tr>
        </table>
      </div>

      <mat-paginator
        #paginator
        [pageSizeOptions]="[5, 10, 25, 50]"
        showFirstLastButtons
        class="paginator"
      ></mat-paginator>
    </div>
  `,
  styles: [`
    .tasks-container {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    .tasks-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .tasks-header h1 {
      margin: 0;
      color: #333;
      font-size: 28px;
    }

    .filters-section {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .filter-field {
      min-width: 180px;
    }

    .table-wrapper {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      margin-bottom: 16px;
    }

    .tasks-table {
      width: 100%;
    }

    .tasks-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      padding: 16px;
    }

    .tasks-table td {
      padding: 12px 16px;
    }

    .task-row {
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.2s;
    }

    .task-row:hover {
      background-color: #f5f5f5;
    }

    .name-cell {
      display: flex;
      flex-direction: column;
    }

    .task-name {
      font-weight: 500;
      color: #333;
    }

    .task-desc {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }

    .field-icon {
      font-size: 1rem;
      color: #6b7280;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .action-buttons button {
      min-width: 68px;
      height: 32px;
      font-size: 0.8rem;
      text-transform: none;
      border-radius: 20px;
      padding: 0 12px;
    }

    .delete-btn {
      min-width: 78px;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      min-width: 90px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.to-do {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.in-progress {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-badge.in-review {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .status-badge.done {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .status-badge.blocked {
      background-color: #ffebee;
      color: #c62828;
    }

    .priority-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .priority-badge.low {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .priority-badge.medium {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .priority-badge.high {
      background-color: #ffe0b2;
      color: #e65100;
    }

    .priority-badge.critical {
      background-color: #ffebee;
      color: #c62828;
    }

    .paginator {
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 1024px) {
      .tasks-container {
        padding: 16px;
      }

      .tasks-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-section {
        flex-direction: column;
      }

      .search-field,
      .filter-field {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .tasks-table {
        font-size: 12px;
      }

      .tasks-table th,
      .tasks-table td {
        padding: 8px;
      }

      .tasks-header h1 {
        font-size: 20px;
      }
    }
  `]
})
export class TasksComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'assignedUser', 'priority', 'status', 'dueDate', 'actions'];
  dataSource = new MatTableDataSource<Task>();

  searchControl = new FormControl('');
  statusFilterControl = new FormControl('');
  priorityFilterControl = new FormControl('');

  private tasks: Task[] = [];

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.updateTable();
    });

    this.searchControl.valueChanges.subscribe(() => this.updateTable());
    this.statusFilterControl.valueChanges.subscribe(() => this.updateTable());
    this.priorityFilterControl.valueChanges.subscribe(() => this.updateTable());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private filterTasks(): Task[] {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const statusFilter = this.statusFilterControl.value || '';
    const priorityFilter = this.priorityFilterControl.value || '';

    return this.tasks.filter(task => {
      const matchesSearch = !searchTerm ||
        task.name.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm);
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  private updateTable(): void {
    const filteredData = this.filterTasks();
    this.dataSource.data = filteredData;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result);
      }
    });
  }

  openEditDialog(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: task
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.updateTask(task.id, result);
      }
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }
}
