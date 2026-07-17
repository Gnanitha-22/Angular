import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Task } from '../../models';

const DUMMY_TASKS: Task[] = [
  { id: 1, name: 'Setup project repository', description: 'Initialize git repository and project structure', assignedUser: 'Mike Johnson', priority: 'High', dueDate: '2024-07-20', status: 'Done' },
  { id: 2, name: 'Design database schema', description: 'Create normalized database schema', assignedUser: 'David Miller', priority: 'High', dueDate: '2024-07-25', status: 'In Progress' },
  { id: 3, name: 'API endpoint development', description: 'Develop RESTful API endpoints', assignedUser: 'Mike Johnson', priority: 'Critical', dueDate: '2024-08-05', status: 'In Progress' },
  { id: 4, name: 'Frontend component library', description: 'Build reusable UI components', assignedUser: 'David Miller', priority: 'High', dueDate: '2024-08-10', status: 'To Do' },
  { id: 5, name: 'Unit testing setup', description: 'Configure Jest and testing utilities', assignedUser: 'Mike Johnson', priority: 'Medium', dueDate: '2024-07-30', status: 'In Review' },
  { id: 6, name: 'Authentication implementation', description: 'Implement JWT-based authentication', assignedUser: 'David Miller', priority: 'Critical', dueDate: '2024-08-01', status: 'In Progress' },
  { id: 7, name: 'Documentation', description: 'Write API and code documentation', assignedUser: 'Mike Johnson', priority: 'Low', dueDate: '2024-08-20', status: 'To Do' },
  { id: 8, name: 'Performance optimization', description: 'Optimize application performance', assignedUser: 'David Miller', priority: 'Medium', dueDate: '2024-08-15', status: 'Blocked' },
  { id: 9, name: 'Integration testing', description: 'Write integration tests for API', assignedUser: 'Mike Johnson', priority: 'High', dueDate: '2024-08-12', status: 'To Do' },
  { id: 10, name: 'Deployment setup', description: 'Configure CI/CD pipeline', assignedUser: 'David Miller', priority: 'High', dueDate: '2024-08-18', status: 'To Do' }
];

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>(DUMMY_TASKS);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.api.getAll<Task>('tasks').pipe(
      catchError(() => {
        // If API fails, use dummy data
        return of(DUMMY_TASKS);
      })
    ).subscribe({
      next: tasks => this.tasksSubject.next(tasks && tasks.length > 0 ? tasks : DUMMY_TASKS),
      error: () => this.tasksSubject.next(DUMMY_TASKS)
    });
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  getTasksSync(): Task[] {
    return this.tasksSubject.getValue();
  }

  getTaskById(id: number): Task | undefined {
    return this.getTasksSync().find(t => t.id === id);
  }

  setTasks(tasks: Task[]): void {
    this.tasksSubject.next(tasks);
  }

  addTask(task: Omit<Task, 'id'>): void {
    this.api.create<Task>('tasks', task).subscribe({
      next: newTask => this.tasksSubject.next([...this.getTasksSync(), newTask]),
      error: () => {}
    });
  }

  updateTask(id: number, task: Partial<Task>): void {
    this.api.update<Task>('tasks', id, task).subscribe({
      next: updated => {
        const tasks = this.getTasksSync().map(item => item.id === id ? updated : item);
        this.tasksSubject.next(tasks);
      },
      error: () => {}
    });
  }

  deleteTask(id: number): void {
    this.api.delete('tasks', id).subscribe({
      next: () => this.tasksSubject.next(this.getTasksSync().filter(item => item.id !== id)),
      error: () => {}
    });
  }
}
