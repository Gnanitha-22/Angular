import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ExportService } from '../../core/services/export.service';
import { NotificationService } from '../../core/services/notification.service';
import { ReportingService } from '../../core/services/reporting.service';

interface ReportCard {
  title: string;
  subtitle: string;
  description: string;
  headers: string[];
  rows: Array<Array<string | number>>;
  filePrefix: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="reports-page">
      <header class="report-header">
        <div>
          <h1>Reporting Center</h1>
          <p>Download project, task, and resource reports for executive review.</p>
        </div>
      </header>

      <section class="report-grid">
        <mat-card class="report-card" *ngFor="let card of reportCards">
          <div class="card-title">
            <div>
              <h2>{{ card.title }}</h2>
              <span>{{ card.subtitle }}</span>
            </div>
            <div class="report-actions">
              <button mat-flat-button color="primary" (click)="exportReport(card, 'pdf')">PDF</button>
              <button mat-flat-button color="accent" (click)="exportReport(card, 'csv')">CSV</button>
            </div>
          </div>

          <p class="card-description">{{ card.description }}</p>

          <div class="report-preview" *ngIf="card.rows.length; else emptyState">
            <table class="preview-table">
              <thead>
                <tr>
                  <th *ngFor="let header of card.headers | slice:0:4">{{ header }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of card.rows | slice:0:3">
                  <td *ngFor="let cell of row | slice:0:4">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <ng-template #emptyState>
            <div class="empty-state">No data available for this report.</div>
          </ng-template>
        </mat-card>
      </section>
    </div>
  `,
  styles: [
    `
      .reports-page {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      .report-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 24px;
      }
      .report-header h1 {
        margin: 0 0 8px;
        font-size: 2rem;
      }
      .report-header p {
        margin: 0;
        color: #64748b;
        max-width: 680px;
      }
      .report-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(280px, 1fr));
        gap: 20px;
      }
      .report-card {
        padding: 24px;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }
      .card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        margin-bottom: 14px;
      }
      .card-title h2 {
        margin: 0;
        font-size: 1.15rem;
      }
      .card-title span {
        color: #475569;
        font-size: 0.95rem;
      }
      .report-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .card-description {
        margin: 0 0 18px;
        color: #475569;
        font-size: 0.97rem;
      }
      .report-preview {
        overflow-x: auto;
        margin-bottom: 18px;
      }
      .preview-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.95rem;
      }
      .preview-table th,
      .preview-table td {
        text-align: left;
        padding: 10px 12px;
      }
      .preview-table th {
        color: #0f172a;
        font-weight: 700;
        border-bottom: 1px solid #e2e8f0;
      }
      .preview-table tr:nth-child(even) {
        background: #f8fafc;
      }
      .empty-state {
        padding: 18px 14px;
        border-radius: 14px;
        background: #f8fafc;
        color: #475569;
        font-weight: 600;
      }
      button {
        min-width: 96px;
      }
      @media (max-width: 1060px) {
        .report-grid {
          grid-template-columns: repeat(2, minmax(240px, 1fr));
        }
      }
      @media (max-width: 760px) {
        .report-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ReportsComponent {
  private reportingService = inject(ReportingService);
  private exportService = inject(ExportService);
  private notificationService = inject(NotificationService);

  reportCards: ReportCard[] = [
    {
      title: 'Project Summary Report',
      subtitle: 'Budget and status overview',
      description: 'Review project health, progress and estimated budget coverage across the portfolio.',
      headers: ['Project', 'Manager', 'Status', 'Budget', 'Active Tasks'],
      rows: this.reportingService.getProjectSummaryReport(),
      filePrefix: 'project-summary'
    },
    {
      title: 'Task Completion Report',
      subtitle: 'Delivery progress and backlog',
      description: 'Monitor task completion levels across active workstreams and key owners.',
      headers: ['Task', 'Owner', 'Status', 'Due Date', 'Completion %'],
      rows: this.reportingService.getTaskCompletionReport(),
      filePrefix: 'task-completion'
    },
    {
      title: 'Resource Utilization Report',
      subtitle: 'Staff allocation and performance',
      description: 'Track utilization and over-allocation for team members across projects.',
      headers: ['Name', 'Project', 'Allocation %', 'Utilization %', 'Status'],
      rows: this.reportingService.getResourceUtilizationReport(),
      filePrefix: 'resource-utilization'
    }
  ];

  exportReport(card: ReportCard, type: 'pdf' | 'csv'): void {
    try {
      if (type === 'pdf') {
        this.exportService.exportPdf(card.title, card.headers, card.rows);
      } else {
        this.exportService.exportCsv(`${card.filePrefix}.csv`, card.headers, card.rows);
      }
      this.notificationService.success(`${card.title} exported successfully.`);
    } catch (error) {
      console.error(error);
      this.notificationService.error(`Unable to export ${card.title}.`);
    }
  }
}
