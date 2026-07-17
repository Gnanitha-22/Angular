import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Project } from '../../models';

const DUMMY_PROJECTS: Project[] = [
  { id: 1, name: 'Website Redesign', code: 'WR-001', description: 'Complete redesign of corporate website', startDate: '2024-01-15', endDate: '2024-06-30', manager: 'Jane Smith', status: 'In Progress', priority: 'High', budget: 50000 },
  { id: 2, name: 'Mobile App Development', code: 'MA-001', description: 'iOS and Android mobile application', startDate: '2024-02-01', endDate: '2024-12-31', manager: 'Sarah Williams', status: 'In Progress', priority: 'Critical', budget: 150000 },
  { id: 3, name: 'Cloud Migration', code: 'CM-001', description: 'Migrate infrastructure to AWS', startDate: '2024-03-10', endDate: '2024-09-30', manager: 'John Doe', status: 'Planning', priority: 'High', budget: 100000 },
  { id: 4, name: 'Data Analytics Platform', code: 'DA-001', description: 'Build real-time analytics dashboard', startDate: '2024-01-20', endDate: '2024-08-15', manager: 'Jane Smith', status: 'In Progress', priority: 'Medium', budget: 75000 },
  { id: 5, name: 'Security Audit', code: 'SA-001', description: 'Comprehensive security assessment', startDate: '2024-04-01', endDate: '2024-05-31', manager: 'Sarah Williams', status: 'On Hold', priority: 'Critical', budget: 45000 },
  { id: 6, name: 'API Integration', code: 'AI-001', description: 'Third-party API integrations', startDate: '2024-02-15', endDate: '2024-07-31', manager: 'John Doe', status: 'Completed', priority: 'Medium', budget: 60000 },
  { id: 7, name: 'Database Optimization', code: 'DO-001', description: 'Optimize database performance', startDate: '2024-03-01', endDate: '2024-05-15', manager: 'Jane Smith', status: 'In Progress', priority: 'High', budget: 35000 }
];

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSubject = new BehaviorSubject<Project[]>(DUMMY_PROJECTS);
  projects$ = this.projectsSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.api.getAll<Project>('projects').pipe(
      catchError(() => {
        // If API fails, use dummy data
        return of(DUMMY_PROJECTS);
      })
    ).subscribe({
      next: projects => this.projectsSubject.next(projects && projects.length > 0 ? projects : DUMMY_PROJECTS),
      error: () => this.projectsSubject.next(DUMMY_PROJECTS)
    });
  }

  getProjects(): Observable<Project[]> {
    return this.projects$;
  }

  getProjectsSync(): Project[] {
    return this.projectsSubject.getValue();
  }

  getProjectById(id: number): Project | undefined {
    return this.getProjectsSync().find(p => p.id === id);
  }

  setProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }

  addProject(project: Omit<Project, 'id'>): void {
    this.api.create<Project>('projects', project).subscribe({
      next: newProject => this.projectsSubject.next([...this.getProjectsSync(), newProject]),
      error: () => {}
    });
  }

  updateProject(id: number, project: Partial<Project>): void {
    this.api.update<Project>('projects', id, project).subscribe({
      next: updated => {
        const projects = this.getProjectsSync().map(item => item.id === id ? updated : item);
        this.projectsSubject.next(projects);
      },
      error: () => {}
    });
  }

  deleteProject(id: number): void {
    this.api.delete('projects', id).subscribe({
      next: () => this.projectsSubject.next(this.getProjectsSync().filter(item => item.id !== id)),
      error: () => {}
    });
  }
}
