import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService, AuthUser } from './auth.service';
import { UserService } from './user.service';
import { ProjectService } from './project.service';
import { TaskService } from './task.service';
import { ResourceAllocationService } from './resource-allocation.service';
import { Project, ResourceAllocation, Task, User } from '../../models';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedTasks: number;
  pendingTasks: number;
  utilization: number;
  overallocatedCount: number;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private authSubject!: BehaviorSubject<AuthUser | null>;
  auth$!: Observable<AuthUser | null>;
  isAuthenticated$!: Observable<boolean>;

  users$!: Observable<User[]>;
  projects$!: Observable<Project[]>;
  tasks$!: Observable<Task[]>;
  allocations$!: Observable<ResourceAllocation[]>;

  dashboard$!: Observable<DashboardStats>;

  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService,
    private allocationService: ResourceAllocationService
  ) {
    this.authSubject = new BehaviorSubject<AuthUser | null>(this.authService.getCurrentUser());
    this.auth$ = this.authSubject.asObservable();
    this.isAuthenticated$ = this.auth$.pipe(map(Boolean));

    this.users$ = this.userService.users$;
    this.projects$ = this.projectService.projects$;
    this.tasks$ = this.taskService.tasks$;
    this.allocations$ = this.allocationService.allocations$;

    this.dashboard$ = combineLatest([this.users$, this.projects$, this.tasks$, this.allocations$]).pipe(
      map(([users, projects, tasks, allocations]) => ({
        totalProjects: projects.length,
        activeProjects: projects.filter(project => project.status === 'In Progress').length,
        completedTasks: tasks.filter(task => task.status === 'Done').length,
        pendingTasks: tasks.filter(task => task.status !== 'Done').length,
        utilization: allocations.length
          ? Math.round(allocations.reduce((sum, allocation) => sum + allocation.utilizationPercent, 0) / allocations.length)
          : 0,
        overallocatedCount: allocations.filter(allocation => allocation.status === 'Overallocated').length
      }))
    );
    this.auth$
      .pipe(
        switchMap(user => (user ? this.loadAllState() : of(null)))
      )
      .subscribe();

    this.refresh$
      .pipe(
        mergeMap(() => this.loadAllState()),
        catchError(() => of(null))
      )
      .subscribe();
  }

  login(email: string, password: string, rememberMe: boolean): Observable<AuthUser> {
    return this.authService.login(email, password, rememberMe).pipe(
      tap(user => this.authSubject.next(user)),
      switchMap(() => this.loadAllState().pipe(map(() => this.authSubject.getValue()!)))
    );
  }

  logout(): void {
    this.authService.logout();
    this.authSubject.next(null);
    this.clearState();
  }

  refresh(): void {
    this.refreshSubject.next();
  }

  private loadAllState(): Observable<{ users: User[]; projects: Project[]; tasks: Task[]; allocations: ResourceAllocation[] } | null> {
    return forkJoin({
      users: this.api.getAll<User>('users'),
      projects: this.api.getAll<Project>('projects'),
      tasks: this.api.getAll<Task>('tasks'),
      allocations: this.api.getAll<ResourceAllocation>('allocations')
    }).pipe(
      tap(({ users, projects, tasks, allocations }) => {
        this.userService.setUsers(users);
        this.projectService.setProjects(projects);
        this.taskService.setTasks(tasks);
        this.allocationService.setAllocations(allocations);
      }),
      catchError(() => {
        this.clearState();
        return of(null);
      })
    );
  }

  private clearState(): void {
    this.userService.setUsers([]);
    this.projectService.setProjects([]);
    this.taskService.setTasks([]);
    this.allocationService.setAllocations([]);
  }
}
