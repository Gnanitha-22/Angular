import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Project } from '../../models';
import { ProjectService } from '../services/project.service';

@Injectable({ providedIn: 'root' })
export class ProjectsResolver implements Resolve<Project[] | null> {
  private projectService = inject(ProjectService);

  resolve(): Observable<Project[] | null> {
    return this.projectService.getProjects().pipe(catchError(() => of(null)));
  }
}
