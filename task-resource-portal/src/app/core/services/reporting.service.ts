import { Injectable } from '@angular/core';
import { ProjectService } from './project.service';
import { ResourceAllocationService } from './resource-allocation.service';
import { TaskService } from './task.service';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private allocationService: ResourceAllocationService
  ) {}

  getProjectSummaryReport(): Array<Array<string | number>> {
    const projects = this.projectService.getProjectsSync();
    const tasks = this.taskService.getTasksSync();
    const activeTaskCount = tasks.filter(task => task.status !== 'Done').length;

    return projects.map(project => [
      project.name,
      project.manager,
      project.status,
      `$${project.budget.toLocaleString()}`,
      activeTaskCount
    ]);
  }

  getTaskCompletionReport(): Array<Array<string | number>> {
    const tasks = this.taskService.getTasksSync();

    return tasks.map(task => [
      task.name,
      task.assignedUser,
      task.status,
      task.dueDate,
      this.statusToCompletion(task.status)
    ]);
  }

  getResourceUtilizationReport(): Array<Array<string | number>> {
    return this.allocationService.getAllocationsSync().map(allocation => [
      allocation.userName,
      allocation.projectName,
      `${allocation.allocationPercent}%`,
      `${allocation.utilizationPercent}%`,
      allocation.status
    ]);
  }

  private statusToCompletion(status: string): string {
    switch (status) {
      case 'Done':
        return '100%';
      case 'In Review':
        return '80%';
      case 'In Progress':
        return '60%';
      case 'Blocked':
        return '30%';
      default:
        return '20%';
    }
  }
}
