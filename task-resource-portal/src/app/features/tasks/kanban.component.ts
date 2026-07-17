import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Task } from '../../models';
import { TaskService } from '../../core/services/task.service';

interface KanbanColumn {
  key: KanbanStatus;
  label: string;
  tasks: Task[];
  color: string;
}

type KanbanStatus = 'To Do' | 'In Progress' | 'Blocked' | 'Completed';

@Component({
  selector: 'app-task-kanban',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <div class="kanban-shell">
      <div class="kanban-header">
        <div>
          <p class="breadcrumb">Tasks / Kanban</p>
          <h1>Enterprise Kanban Board</h1>
          <p class="subtitle">Drag tasks between columns to update status and prioritize delivery.</p>
        </div>
        <div class="kanban-actions">
          <button mat-stroked-button color="primary" routerLink="/tasks">Back to Table</button>
        </div>
      </div>

      <div class="kanban-toolbar">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search tasks</mat-label>
          <input matInput [formControl]="searchControl" placeholder="Search by name or description" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="filter-field">
          <mat-label>Priority</mat-label>
          <mat-select [formControl]="priorityControl">
            <mat-option value="">All</mat-option>
            <mat-option value="Low">Low</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="High">High</mat-option>
            <mat-option value="Critical">Critical</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="kanban-board">
        <ng-container *ngFor="let column of columns">
          <section class="kanban-column" [ngClass]="getColumnClass(column.key)" cdkDropList [cdkDropListData]="column.tasks" [cdkDropListConnectedTo]="connectedDropLists" (cdkDropListDropped)="onDrop($event, column)">
            <div class="column-header" [style.background]="column.color">
              <div>
                <h2>{{ column.label }}</h2>
                <p>{{ column.tasks.length }} task{{ column.tasks.length === 1 ? '' : 's' }}</p>
              </div>
            </div>
            <div class="kanban-list">
              <div class="kanban-card" *ngFor="let task of column.tasks" cdkDrag>
                <div class="card-top">
                  <span class="task-priority" [ngClass]="getPriorityClass(task.priority)">{{ task.priority }}</span>
                  <span class="task-status">{{ task.status }}</span>
                </div>
                <h3>{{ task.name }}</h3>
                <p>{{ task.description }}</p>
                <div class="card-meta">
                  <span>{{ task.assignedUser }}</span>
                  <span>{{ task.dueDate | date: 'MMM d' }}</span>
                </div>
              </div>
            </div>
          </section>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .kanban-shell {
      padding: 24px;
      min-height: 100vh;
      background: #f4f7fb;
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .breadcrumb {
      margin: 0 0 8px;
      color: #64748b;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .kanban-header h1 {
      margin: 0;
      font-size: 2rem;
      color: #111827;
    }

    .subtitle {
      margin: 12px 0 0;
      color: #475569;
      max-width: 560px;
      line-height: 1.6;
    }

    .kanban-actions {
      display: flex;
      gap: 12px;
    }

    .kanban-toolbar {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .search-field,
    .filter-field {
      min-width: 240px;
      flex: 1;
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(4, minmax(220px, 1fr));
      gap: 20px;
    }

    .kanban-column {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 12px 35px rgba(15, 23, 42, 0.08);
      display: flex;
      flex-direction: column;
      min-height: 520px;
      overflow: hidden;
    }

    .column-header {
      padding: 18px 20px;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .column-header h2 {
      margin: 0;
      font-size: 1.1rem;
      letter-spacing: 0.02em;
    }

    .column-header p {
      margin: 4px 0 0;
      font-size: 0.9rem;
      opacity: 0.85;
    }

    .kanban-list {
      padding: 20px;
      display: grid;
      gap: 16px;
      flex: 1;
      overflow-y: auto;
      min-height: 220px;
    }

    .kanban-card {
      background: #ffffff;
      border-radius: 18px;
      border: 1px solid rgba(148, 163, 184, 0.16);
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 160px;
      cursor: grab;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .kanban-card:active {
      cursor: grabbing;
    }

    .kanban-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 18px 38px rgba(15, 23, 42, 0.12);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .task-priority,
    .task-status {
      border-radius: 999px;
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.01em;
      white-space: nowrap;
    }

    .task-priority.low { background: #eff6ff; color: #1d4ed8; }
    .task-priority.medium { background: #fef3c7; color: #b45309; }
    .task-priority.high { background: #fff7ed; color: #c2410c; }
    .task-priority.critical { background: #fee2e2; color: #b91c1c; }

    .task-status { background: #e2e8f0; color: #334155; }

    .kanban-card h3 {
      margin: 0;
      font-size: 1rem;
      color: #0f172a;
      line-height: 1.4;
    }

    .kanban-card p {
      margin: 0;
      color: #475569;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .card-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
      color: #64748b;
      font-size: 0.9rem;
    }

    .kanban-column.cdk-drop-list-dragging {
      background: #f8fafc;
    }

    .kanban-card.cdk-drag-preview {
      box-shadow: 0 22px 45px rgba(15, 23, 42, 0.18);
      border: 1px solid rgba(15, 23, 42, 0.08);
    }

    .kanban-card.cdk-drag-placeholder {
      opacity: 0.5;
      transform: none !important;
    }

    @media (max-width: 1280px) {
      .kanban-board {
        grid-template-columns: repeat(2, minmax(220px, 1fr));
      }
    }

    @media (max-width: 800px) {
      .kanban-board {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TaskKanbanComponent implements OnInit {
  searchControl = new FormControl('');
  priorityControl = new FormControl('');

  columns: KanbanColumn[] = [
    { key: 'To Do', label: 'To Do', tasks: [], color: 'linear-gradient(135deg, #2563eb, #3b82f6)' },
    { key: 'In Progress', label: 'In Progress', tasks: [], color: 'linear-gradient(135deg, #f59e0b, #f97316)' },
    { key: 'Blocked', label: 'Blocked', tasks: [], color: 'linear-gradient(135deg, #ef4444, #f43f5e)' },
    { key: 'Completed', label: 'Completed', tasks: [], color: 'linear-gradient(135deg, #16a34a, #22c55e)' }
  ];

  private allTasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.allTasks = tasks;
      this.buildColumns();
    });

    this.searchControl.valueChanges.subscribe(() => this.buildColumns());
    this.priorityControl.valueChanges.subscribe(() => this.buildColumns());
  }

  get connectedDropLists(): string[] {
    return this.columns.map(column => column.key);
  }

  getColumnClass(status: KanbanStatus): string {
    return status.replace(/\s+/g, '-').toLowerCase();
  }

  onDrop(event: CdkDragDrop<Task[]>, column: KanbanColumn): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const task = event.previousContainer.data[event.previousIndex];
    const newStatus = this.mapColumnToStatus(column.key, task.status);

    this.taskService.updateTask(task.id, { status: newStatus });
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
  }

  getPriorityClass(priority: string): string {
    return priority.toLowerCase();
  }

  private mapColumnToStatus(column: KanbanStatus, currentStatus: string): Task['status'] {
    switch (column) {
      case 'To Do':
        return 'To Do';
      case 'In Progress':
        return currentStatus === 'In Review' ? 'In Review' : 'In Progress';
      case 'Blocked':
        return 'Blocked';
      case 'Completed':
        return 'Done';
      default:
        return 'To Do';
    }
  }

  private mapTaskStatusToColumn(status: Task['status']): KanbanStatus {
    switch (status) {
      case 'To Do':
        return 'To Do';
      case 'In Progress':
      case 'In Review':
        return 'In Progress';
      case 'Blocked':
        return 'Blocked';
      case 'Done':
        return 'Completed';
      default:
        return 'To Do';
    }
  }

  private buildColumns(): void {
    const filteredTasks = this.allTasks.filter(task => {
      const search = this.searchControl.value?.toLowerCase() || '';
      const matchesSearch = !search || task.name.toLowerCase().includes(search) || task.description.toLowerCase().includes(search) || task.assignedUser.toLowerCase().includes(search);
      const matchesPriority = !this.priorityControl.value || task.priority === this.priorityControl.value;
      return matchesSearch && matchesPriority;
    });

    this.columns.forEach(column => {
      column.tasks = filteredTasks.filter(task => this.mapTaskStatusToColumn(task.status) === column.key);
    });
  }
}
