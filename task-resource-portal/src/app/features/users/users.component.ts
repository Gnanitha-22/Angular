import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { User } from '../../models';
import { UserService } from '../../core/services/user.service';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule
  ],
  template: `
    <div class="users-container">
      <!-- Header -->
      <div class="users-header">
        <h1>User Management</h1>
        <p class="subtitle">Manage team members, roles, and permissions</p>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <button mat-raised-button color="primary" (click)="openAddDialog()" class="add-btn">
          ➕ Add New User
        </button>

        <div class="filter-controls">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search</mat-label>
            <input matInput [formControl]="searchControl" placeholder="Search by name or email..." />
            <mat-icon matSuffix>🔍</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Role Filter</mat-label>
            <mat-select [formControl]="roleFilterControl">
              <mat-option value="">All Roles</mat-option>
              <mat-option value="Admin">Admin</mat-option>
              <mat-option value="Project Manager">Project Manager</mat-option>
              <mat-option value="Team Member">Team Member</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status Filter</mat-label>
            <mat-select [formControl]="statusFilterControl">
              <mat-option value="">All Status</mat-option>
              <mat-option value="Active">Active</mat-option>
              <mat-option value="Inactive">Inactive</mat-option>
              <mat-option value="On Leave">On Leave</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table mat-table [dataSource]="dataSource" matSort class="users-table">
          <!-- User ID Column -->
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <!-- Name Column -->
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
            <td mat-cell *matCellDef="let element">
              <div class="name-cell">
                <div class="avatar">{{ element.name.charAt(0) }}</div>
                <div>
                  <div class="user-name">{{ element.name }}</div>
                  <div class="user-email">{{ element.email }}</div>
                </div>
              </div>
            </td>
          </ng-container>

          <!-- Email Column -->
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
            <td mat-cell *matCellDef="let element">{{ element.email }}</td>
          </ng-container>

          <!-- Role Column -->
          <ng-container matColumnDef="role">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
            <td mat-cell *matCellDef="let element">
              <span class="role-badge" [ngClass]="'role-' + getRoleClass(element.role)">
                {{ element.role }}
              </span>
            </td>
          </ng-container>

          <!-- Department Column -->
          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
            <td mat-cell *matCellDef="let element">{{ element.department }}</td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
            <td mat-cell *matCellDef="let element">
              <span class="status-badge" [ngClass]="'status-' + element.status.toLowerCase().replace(' ', '-')">
                {{ element.status }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element" class="actions-cell">
              <button mat-icon-button matTooltip="Edit" (click)="openEditDialog(element)" class="edit-btn">
                ✏️
              </button>
              <button mat-icon-button matTooltip="Delete" (click)="deleteUser(element.id)" class="delete-btn">
                🗑️
              </button>
            </td>
          </ng-container>

          <!-- Header and Data Rows -->
          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>

      <!-- Paginator -->
      <mat-paginator
        [pageSizeOptions]="[5, 10, 25, 50]"
        [pageSize]="10"
        showFirstLastButtons
        class="paginator">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .users-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .users-header {
      margin-bottom: 32px;
    }

    .users-header h1 {
      font-size: 32px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }

    /* Controls Section */
    .controls-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
      flex-wrap: wrap;
    }

    .add-btn {
      white-space: nowrap;
    }

    .filter-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      flex: 1;
      min-width: 300px;
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .filter-field {
      min-width: 150px;
    }

    /* Table Wrapper */
    .table-wrapper {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      overflow: hidden;
      margin-bottom: 20px;
    }

    .users-table {
      width: 100%;
    }

    .users-table th {
      background: #f8fafc;
      font-weight: 600;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding: 16px;
      text-align: left;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .users-table td {
      padding: 16px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
    }

    .users-table tr:hover {
      background: #f8fafc;
    }

    /* Name Cell */
    .name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #3b82f6;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
    }

    .user-name {
      font-weight: 600;
      color: #0f172a;
    }

    .user-email {
      font-size: 12px;
      color: #64748b;
    }

    /* Role Badge */
    .role-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .role-admin {
      background: rgba(239, 68, 68, 0.1);
      color: #dc2626;
    }

    .role-project-manager {
      background: rgba(245, 158, 11, 0.1);
      color: #d97706;
    }

    .role-team-member {
      background: rgba(59, 130, 246, 0.1);
      color: #2563eb;
    }

    /* Status Badge */
    .status-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
    }

    .status-active {
      background: rgba(16, 185, 129, 0.1);
      color: #059669;
    }

    .status-inactive {
      background: rgba(107, 114, 128, 0.1);
      color: #4b5563;
    }

    .status-on-leave {
      background: rgba(245, 158, 11, 0.1);
      color: #d97706;
    }

    /* Actions Cell */
    .actions-cell {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .edit-btn {
      color: #3b82f6;
    }

    .delete-btn {
      color: #ef4444;
    }

    /* Paginator */
    .paginator {
      background: white;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 1024px) {
      .controls-section {
        flex-direction: column;
        align-items: stretch;
      }

      .filter-controls {
        flex-direction: column;
      }

      .search-field,
      .filter-field {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .users-container {
        padding: 16px;
      }

      .users-header h1 {
        font-size: 24px;
      }

      .users-table th,
      .users-table td {
        padding: 12px 8px;
        font-size: 12px;
      }

      .name-cell {
        flex-direction: column;
        align-items: flex-start;
      }

      .avatar {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }

      .actions-cell {
        flex-direction: column;
      }
    }
  `]
})
export class UsersComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'department', 'status', 'actions'];
  dataSource!: MatTableDataSource<User>;
  users: User[] = [];

  searchControl = new FormControl('');
  roleFilterControl = new FormControl('');
  statusFilterControl = new FormControl('');

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<User>([]);
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      this.updateTable();
    });

    this.searchControl.valueChanges.subscribe(() => this.updateTable());
    this.roleFilterControl.valueChanges.subscribe(() => this.updateTable());
    this.statusFilterControl.valueChanges.subscribe(() => this.updateTable());
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private updateTable(): void {
    const filteredData = this.filterUsers();
    this.dataSource.data = filteredData;
  }

  private filterUsers(): User[] {
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    const roleFilter = this.roleFilterControl.value || '';
    const statusFilter = this.statusFilterControl.value || '';

    return this.users.filter(user => {
      const matchesSearch = !searchTerm ||
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm);

      const matchesRole = !roleFilter || user.role === roleFilter;
      const matchesStatus = !statusFilter || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.addUser(result);
      }
    });
  }

  openEditDialog(user: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result);
      }
    });
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id);
    }
  }

  getRoleClass(role: string): string {
    return role.toLowerCase().replace(/\s+/g, '-');
  }
}

