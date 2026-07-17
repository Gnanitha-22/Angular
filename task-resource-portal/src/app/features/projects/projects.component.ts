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
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Project } from '../../models';
import { ProjectService } from '../../core/services/project.service';
import { ProjectDialogComponent } from './project-dialog.component';

@Component({
  selector: 'app-projects',
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
    MatIconModule,
    MatDialogModule,
    RouterModule
  ],
  template: `
    <div class="projects-container">
      <div class="projects-header">
        <h1>Projects Management</h1>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          ➕ Add New Project
        </button>
      </div>

      <div class="filters-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Search by project name or code...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Status Filter</mat-label>
          <mat-select [formControl]="statusFilterControl">
            <mat-option value="">All Status</mat-option>
            <mat-option value="Planning">Planning</mat-option>
            <mat-option value="In Progress">In Progress</mat-option>
            <mat-option value="On Hold">On Hold</mat-option>
            <mat-option value="Completed">Completed</mat-option>
            <mat-option value="Cancelled">Cancelled</mat-option>
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
        <table mat-table [dataSource]="dataSource" matSort class="projects-table">
          <!-- ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Project Name</th>
            <td mat-cell *matCellDef="let element">
              <div class="name-cell">
                <div class="project-code">{{ element.code }}</div>
                <div class="project-name">{{ element.name }}</div>
              </div>
            </td>
          </ng-container>

          <!-- Manager Column -->
          <ng-container matColumnDef="manager">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Manager</th>
            <td mat-cell *matCellDef="let element">{{ element.manager }}</td>
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

          <!-- Priority Column -->
          <ng-container matColumnDef="priority">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
            <td mat-cell *matCellDef="let element">
              <span class="priority-badge" [ngClass]="getPriorityClass(element.priority)">
                {{ element.priority }}
              </span>
            </td>
          </ng-container>

          <!-- Budget Column -->
          <ng-container matColumnDef="budget">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Budget</th>
            <td mat-cell *matCellDef="let element">
              {{ element.budget }}
            </td>
          </ng-container>

          <!-- Dates Column -->
          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef>Dates</th>
            <td mat-cell *matCellDef="let element">
              <div class="dates-cell">
                <div>Start: {{ element.startDate | date: 'MMM d, yyyy' }}</div>
                <div>End: {{ element.endDate | date: 'MMM d, yyyy' }}</div>
              </div>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="openEditDialog(element)" title="Edit">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProject(element.id)" title="Delete">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="project-row"></tr>
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
    .projects-container {
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    .projects-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .projects-header h1 {
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

    .projects-table {
      width: 100%;
    }

    .projects-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: 600;
      padding: 16px;
    }

    .projects-table td {
      padding: 12px 16px;
    }

    .project-row {
      border-bottom: 1px solid #e0e0e0;
      transition: background-color 0.2s;
    }

    .project-row:hover {
      background-color: #f5f5f5;
    }

    .name-cell {
      display: flex;
      flex-direction: column;
    }

    .project-code {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .project-name {
      font-weight: 500;
      color: #333;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.planning {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    .status-badge.in-progress {
      background-color: #fff3e0;
      color: #f57c00;
    }

    .status-badge.on-hold {
      background-color: #f3e5f5;
      color: #7b1fa2;
    }

    .status-badge.completed {
      background-color: #e8f5e9;
      color: #388e3c;
    }

    .status-badge.cancelled {
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

    .dates-cell {
      font-size: 12px;
      line-height: 1.6;
      color: #666;
    }

    .paginator {
      background: white;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 1024px) {
      .projects-container {
        padding: 16px;
      }

      .projects-header {
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
      .projects-table {
        font-size: 12px;
      }

      .projects-table th,
      .projects-table td {
        padding: 8px;
      }

      .projects-header h1 {
        font-size: 20px;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'manager', 'status', 'priority', 'budget', 'dates', 'actions'];
  dataSource = new MatTableDataSource<Project>();

  searchControl = new FormControl('');
  statusFilterControl = new FormControl('');
  priorityFilterControl = new FormControl('');

  private projects: Project[] = [];

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projects => {
      this.projects = projects;
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

  private filterProjects(): Project[] {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const statusFilter = this.statusFilterControl.value || '';
    const priorityFilter = this.priorityFilterControl.value || '';

    return this.projects.filter(project => {
      const matchesSearch = !searchTerm || 
        project.name.toLowerCase().includes(searchTerm) || 
        project.code.toLowerCase().includes(searchTerm);
      const matchesStatus = !statusFilter || project.status === statusFilter;
      const matchesPriority = !priorityFilter || project.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  private updateTable(): void {
    const filteredData = this.filterProjects();
    this.dataSource.data = filteredData;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.addProject(result);
      }
    });
  }

  openEditDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      width: '500px',
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.updateProject(project.id, result);
      }
    });
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id);
    }
  }

  getStatusClass(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }
}
