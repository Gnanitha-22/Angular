import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-container" *ngIf="kpis$ | async as kpis">
      <!-- Header -->
      <div class="dashboard-header">
        <h1>Executive Dashboard</h1>
        <p class="subtitle">Overview of projects, tasks, and resource health</p>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon">📊</div>
          <div class="kpi-content">
            <p class="kpi-label">Total Projects</p>
            <p class="kpi-value">{{ kpis.totalProjects }}</p>
          </div>
          <div class="kpi-trend trend-up">↑ 12%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">🚀</div>
          <div class="kpi-content">
            <p class="kpi-label">Active Projects</p>
            <p class="kpi-value">{{ kpis.activeProjects }}</p>
          </div>
          <div class="kpi-trend trend-up">↑ 8%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">✅</div>
          <div class="kpi-content">
            <p class="kpi-label">Completed Tasks</p>
            <p class="kpi-value">{{ kpis.completedTasks }}</p>
          </div>
          <div class="kpi-trend trend-up">↑ 15%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">⏳</div>
          <div class="kpi-content">
            <p class="kpi-label">Pending Tasks</p>
            <p class="kpi-value">{{ kpis.pendingTasks }}</p>
          </div>
          <div class="kpi-trend trend-down">↓ 3%</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">📈</div>
          <div class="kpi-content">
            <p class="kpi-label">Utilization %</p>
            <p class="kpi-value">{{ kpis.utilization }}%</p>
          </div>
          <div class="kpi-trend trend-up">↑ 5%</div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-grid">
        <!-- Project Status Chart -->
        <div class="chart-card">
          <h3>Project Status</h3>
          <div id="projectStatusChart" class="chart-container"></div>
        </div>

        <!-- Task Distribution Chart -->
        <div class="chart-card">
          <h3>Task Distribution</h3>
          <div id="taskDistributionChart" class="chart-container"></div>
        </div>

        <!-- Resource Allocation Chart -->
        <div class="chart-card">
          <h3>Resource Allocation</h3>
          <div id="resourceAllocationChart" class="chart-container"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 32px;
    }

    .dashboard-header h1 {
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

    /* KPI Grid */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .kpi-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
    }

    .kpi-card:hover {
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
      transform: translateY(-2px);
    }

    .kpi-icon {
      font-size: 32px;
      min-width: 50px;
      text-align: center;
    }

    .kpi-content {
      flex: 1;
    }

    .kpi-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .kpi-value {
      font-size: 28px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .kpi-trend {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;
      text-align: center;
      white-space: nowrap;
    }

    .trend-up {
      color: #059669;
      background: rgba(5, 150, 105, 0.1);
    }

    .trend-down {
      color: #dc2626;
      background: rgba(220, 38, 38, 0.1);
    }

    /* Charts Grid */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 20px;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
    }

    .chart-card h3 {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
      margin: 0 0 16px 0;
    }

    .chart-container {
      min-height: 300px;
    }

    @media (max-width: 1024px) {
      .kpi-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .dashboard-container {
        padding: 16px;
      }

      .dashboard-header h1 {
        font-size: 24px;
      }

      .kpi-grid {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .kpi-card {
        padding: 16px;
      }

      .kpi-value {
        font-size: 24px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  kpis$: Observable<any> | null = null;

  chartsReady = false;

  constructor(private appState: AppStateService) {
    this.kpis$ = this.appState.dashboard$;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    this.createProjectStatusChart();
    this.createTaskDistributionChart();
    this.createResourceAllocationChart();
  }

  private createProjectStatusChart(): void {
    const element = document.querySelector('#projectStatusChart');
    if (!element) return;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
      },
      series: [8, 10, 4, 2],
      labels: ['Active', 'On Hold', 'Completed', 'Cancelled'],
      colors: ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'],
      plotOptions: {
        pie: {
          donut: {
            size: '65%'
          }
        }
      },
      stroke: {
        colors: ['#ffffff']
      },
      dataLabels: {
        enabled: true,
        formatter: (val: any) => val.toFixed(0) + '%'
      },
      legend: {
        position: 'bottom'
      }
    };

    new ApexCharts(element as HTMLElement, options).render();
  }

  private createTaskDistributionChart(): void {
    const element = document.querySelector('#taskDistributionChart');
    if (!element) return;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'bar',
        height: 300,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
      },
      series: [{
        name: 'Tasks',
        data: [45, 38, 52, 41, 34, 28, 19]
      }],
      xaxis: {
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      colors: ['#3b82f6'],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 6
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      }
    };

    new ApexCharts(element as HTMLElement, options).render();
  }

  private createResourceAllocationChart(): void {
    const element = document.querySelector('#resourceAllocationChart');
    if (!element) return;

    const options: ApexCharts.ApexOptions = {
      chart: {
        type: 'area',
        height: 300,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto'
      },
      series: [
        {
          name: 'Engineers',
          data: [25, 30, 28, 32, 35, 38, 40]
        },
        {
          name: 'Designers',
          data: [12, 14, 15, 16, 18, 19, 20]
        },
        {
          name: 'Managers',
          data: [8, 8, 9, 10, 10, 11, 12]
        }
      ],
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']
      },
      colors: ['#3b82f6', '#10b981', '#f59e0b'],
      fill: {
        type: 'gradient',
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.1
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      }
    };

    new ApexCharts(element as HTMLElement, options).render();
  }
}
