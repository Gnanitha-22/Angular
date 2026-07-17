import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ResourceAllocationService } from '../../core/services/resource-allocation.service';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { Subscription, combineLatest } from 'rxjs';
import { ApexOptions } from 'apexcharts';
import ApexCharts from 'apexcharts';
import { ProjectOption, ResourceAllocation, ResourceOption } from '../../models';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule
  ],
  template: `
    <section class="resource-shell">
      <div class="resource-header">
        <div>
          <p class="breadcrumb">Resources</p>
          <h1>Resource Allocation Dashboard</h1>
          <p class="subtitle">Track allocation, utilization, and over-allocation risks across your project teams.</p>
        </div>
      </div>

      <div class="resource-metrics">
        <article class="metric-card">
          <p class="metric-label">Total Assignments</p>
          <p class="metric-value">{{ allocations.length }}</p>
        </article>
        <article class="metric-card">
          <p class="metric-label">Average Utilization</p>
          <p class="metric-value">{{ averageUtilization }}%</p>
        </article>
        <article class="metric-card">
          <p class="metric-label">Overallocated</p>
          <p class="metric-value over">{{ overallocatedCount }}</p>
        </article>
        <article class="metric-card">
          <p class="metric-label">Healthy Utilization</p>
          <p class="metric-value healthy">{{ healthyCount }}</p>
        </article>
      </div>

      <div class="resource-toolbar">
        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Search allocations</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Search by user, project or status" />
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Project</mat-label>
          <mat-select [formControl]="projectControl">
            <mat-option value="">All Projects</mat-option>
            <mat-option *ngFor="let project of projects" [value]="project.name">{{ project.name }}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Resource</mat-label>
          <mat-select [formControl]="userControl">
            <mat-option value="">All Users</mat-option>
            <mat-option *ngFor="let user of users" [value]="user.name">{{ user.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="resource-content">
        <div class="allocation-panel">
          <div class="allocation-actions">
            <h2>Manage Allocations</h2>
            <button mat-flat-button color="primary" (click)="resetForm()">New Allocation</button>
          </div>

          <form class="allocation-form" [formGroup]="allocationForm" (ngSubmit)="saveAllocation()">
            <mat-form-field appearance="outline">
              <mat-label>User</mat-label>
              <mat-select formControlName="userName" required>
                <mat-option *ngFor="let user of users" [value]="user.name">{{ user.name }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Project</mat-label>
              <mat-select formControlName="projectName" required>
                <mat-option *ngFor="let project of projects" [value]="project.name">{{ project.name }}</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Allocation %</mat-label>
              <input matInput type="number" formControlName="allocationPercent" min="0" max="200" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Utilization %</mat-label>
              <input matInput type="number" formControlName="utilizationPercent" min="0" max="200" />
            </mat-form-field>

            <div class="form-actions">
              <button mat-flat-button color="primary" type="submit" [disabled]="allocationForm.invalid">{{ editingAllocationId ? 'Update' : 'Create' }}</button>
              <button mat-stroked-button type="button" (click)="resetForm()">Clear</button>
            </div>
          </form>
        </div>

        <div class="allocation-board">
          <div class="charts-grid">
            <mat-card class="chart-card">
              <h3>Utilization by Status</h3>
              <div id="utilizationStatusChart" class="chart-container"></div>
            </mat-card>
            <mat-card class="chart-card">
              <h3>Allocation by Project</h3>
              <div id="allocationProjectChart" class="chart-container"></div>
            </mat-card>
          </div>

          <mat-card class="table-card">
            <div class="table-header">
              <h2>Allocation Table</h2>
              <span>{{ dataSource.data.length }} records</span>
            </div>
            <table mat-table [dataSource]="dataSource" class="allocation-table">
              <ng-container matColumnDef="userName">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let element">{{ element.userName }}</td>
              </ng-container>

              <ng-container matColumnDef="projectName">
                <th mat-header-cell *matHeaderCellDef>Project</th>
                <td mat-cell *matCellDef="let element">{{ element.projectName }}</td>
              </ng-container>

              <ng-container matColumnDef="allocationPercent">
                <th mat-header-cell *matHeaderCellDef>Allocation %</th>
                <td mat-cell *matCellDef="let element">{{ element.allocationPercent }}%</td>
              </ng-container>

              <ng-container matColumnDef="utilizationPercent">
                <th mat-header-cell *matHeaderCellDef>Utilization %</th>
                <td mat-cell *matCellDef="let element">{{ element.utilizationPercent }}%</td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let element">
                  <span class="status-pill" [ngClass]="element.status === 'Overallocated' ? 'overallocated' : 'healthy'">{{ element.status }}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let element">
                  <button mat-icon-button color="primary" aria-label="Edit" (click)="editAllocation(element)">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" aria-label="Delete" (click)="deleteAllocation(element.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <mat-paginator [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .resource-shell {
      padding: 24px;
      min-height: 100vh;
      background: #f8fafc;
    }

    .resource-header {
      margin-bottom: 24px;
    }

    .breadcrumb {
      margin: 0 0 8px;
      color: #64748b;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #0f172a;
    }

    .subtitle {
      margin: 12px 0 0;
      color: #475569;
      line-height: 1.6;
      max-width: 640px;
    }

    .resource-metrics {
      display: grid;
      grid-template-columns: repeat(4, minmax(180px, 1fr));
      gap: 16px;
      margin: 24px 0;
    }

    .metric-card {
      padding: 20px;
      background: white;
      border-radius: 18px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .metric-label {
      margin: 0 0 8px;
      color: #64748b;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .metric-value {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      color: #111827;
    }

    .metric-value.over {
      color: #b91c1c;
    }

    .metric-value.healthy {
      color: #15803d;
    }

    .resource-toolbar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .filter-field {
      min-width: 260px;
      flex: 1;
    }

    .allocation-panel,
    .allocation-board {
      background: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .resource-content {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 24px;
    }

    .allocation-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      gap: 12px;
    }

    .allocation-form {
      display: grid;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .charts-grid {
      display: grid;
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-card {
      padding: 20px;
      border-radius: 20px;
      background: #ffffff;
      min-height: 320px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .chart-card h3 {
      margin: 0 0 16px;
      font-size: 1rem;
      color: #111827;
    }

    .chart-container {
      width: 100%;
      height: 280px;
    }

    .table-card {
      padding: 20px;
      border-radius: 20px;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
    }

    .allocation-table {
      width: 100%;
      border-collapse: collapse;
    }

    .allocation-table th,
    .allocation-table td {
      padding: 14px 12px;
      text-align: left;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    }

    .status-pill {
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 700;
    }

    .status-pill.healthy {
      background: rgba(16, 185, 129, 0.12);
      color: #047857;
    }

    .status-pill.overallocated {
      background: rgba(239, 68, 68, 0.12);
      color: #b91c1c;
    }

    @media (max-width: 1160px) {
      .resource-metrics {
        grid-template-columns: repeat(2, minmax(180px, 1fr));
      }
      .resource-content {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 760px) {
      .resource-toolbar {
        flex-direction: column;
      }
      .filter-field {
        width: 100%;
      }
    }
  `]
})
export class ResourcesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['userName', 'projectName', 'allocationPercent', 'utilizationPercent', 'status', 'actions'];
  dataSource = new MatTableDataSource<ResourceAllocation>([]);

  searchControl = new FormControl('');
  projectControl = new FormControl('');
  userControl = new FormControl('');

  allocationForm = new FormGroup({
    userName: new FormControl('', Validators.required),
    projectName: new FormControl('', Validators.required),
    allocationPercent: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(200)]),
    utilizationPercent: new FormControl(0, [Validators.required, Validators.min(0), Validators.max(200)])
  });

  allocations: ResourceAllocation[] = [];
  users: ResourceOption[] = [];
  projects: ProjectOption[] = [];

  averageUtilization = 0;
  overallocatedCount = 0;
  healthyCount = 0;

  editingAllocationId: number | null = null;

  private statusChart?: ApexCharts;
  private projectChart?: ApexCharts;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private subscriptions = new Subscription();

  constructor(
    private allocationService: ResourceAllocationService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([
        this.allocationService.allocations$,
        this.userService.users$,
        this.projectService.projects$
      ]).subscribe(([allocations, users, projects]) => {
        this.allocations = allocations;
        this.users = users.map(user => ({ id: user.id, name: user.name, role: user.role }));
        this.projects = projects.map(project => ({ id: project.id, name: project.name, code: project.code }));
        this.applyFilter();
        this.renderCharts();
      })
    );

    this.searchControl.valueChanges.subscribe(() => this.applyFilter());
    this.projectControl.valueChanges.subscribe(() => this.applyFilter());
    this.userControl.valueChanges.subscribe(() => this.applyFilter());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.statusChart?.destroy();
    this.projectChart?.destroy();
    this.subscriptions.unsubscribe();
  }

  applyFilter(): void {
    const search = this.searchControl.value?.toLowerCase() || '';
    const selectedProject = this.projectControl.value;
    const selectedUser = this.userControl.value;

    this.dataSource.data = this.allocations.filter(allocation => {
      const matchesSearch =
        allocation.userName.toLowerCase().includes(search) ||
        allocation.projectName.toLowerCase().includes(search) ||
        allocation.status.toLowerCase().includes(search);
      const matchesProject = !selectedProject || allocation.projectName === selectedProject;
      const matchesUser = !selectedUser || allocation.userName === selectedUser;
      return matchesSearch && matchesProject && matchesUser;
    });

    this.updateSummary();
    this.renderCharts();
  }

  resetForm(): void {
    this.editingAllocationId = null;
    this.allocationForm.reset({
      userName: '',
      projectName: '',
      allocationPercent: 0,
      utilizationPercent: 0
    });
  }

  saveAllocation(): void {
    if (this.allocationForm.invalid) {
      return;
    }

    const allocation = this.allocationForm.value as Omit<ResourceAllocation, 'id' | 'status'>;

    if (this.editingAllocationId) {
      this.allocationService.updateAllocation(this.editingAllocationId, allocation);
    } else {
      this.allocationService.addAllocation(allocation);
    }

    this.resetForm();
  }

  editAllocation(allocation: ResourceAllocation): void {
    this.editingAllocationId = allocation.id;
    this.allocationForm.setValue({
      userName: allocation.userName,
      projectName: allocation.projectName,
      allocationPercent: allocation.allocationPercent,
      utilizationPercent: allocation.utilizationPercent
    });
  }

  deleteAllocation(id: number): void {
    this.allocationService.deleteAllocation(id);
  }

  private updateSummary(): void {
    const data = this.dataSource.data;
    this.averageUtilization = data.length ? Math.round(data.reduce((sum, item) => sum + item.utilizationPercent, 0) / data.length) : 0;
    this.overallocatedCount = data.filter(item => item.status === 'Overallocated').length;
    this.healthyCount = data.filter(item => item.status === 'Healthy').length;
  }

  private renderCharts(): void {
    setTimeout(() => {
      this.statusChart?.destroy();
      this.projectChart?.destroy();
      this.statusChart = new ApexCharts(document.querySelector('#utilizationStatusChart') as HTMLElement, this.createStatusChart());
      this.projectChart = new ApexCharts(document.querySelector('#allocationProjectChart') as HTMLElement, this.createProjectChart());
      this.statusChart.render();
      this.projectChart.render();
    }, 0);
  }

  private createStatusChart(): ApexOptions {
    const healthy = this.dataSource.data.filter(item => item.status === 'Healthy').length;
    const overallocated = this.dataSource.data.filter(item => item.status === 'Overallocated').length;

    return {
      chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true } },
      labels: ['Healthy', 'Overallocated'],
      series: [healthy, overallocated],
      colors: ['#16a34a', '#dc2626'],
      legend: { position: 'bottom' },
      dataLabels: { enabled: true, formatter: (val: number) => `${Math.round(val)}%` }
    };
  }

  private createProjectChart(): ApexOptions {
    const aggregation = this.projects.map(project => ({
      project: project.name,
      total: this.dataSource.data.filter(item => item.projectName === project.name).reduce((sum, item) => sum + item.allocationPercent, 0)
    }));

    return {
      chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true } },
      series: [{ name: 'Allocation %', data: aggregation.map(item => item.total) }],
      xaxis: { categories: aggregation.map(item => item.project), labels: { rotate: -15 } },
      yaxis: { title: { text: 'Allocation %' } },
      colors: ['#2563eb']
    };
  }
}

