import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceItem, TaskItem } from './models';

@Injectable({ providedIn: 'root' })
export class AppService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TaskItem[]> {
    return this.http.get<TaskItem[]>(`${this.apiUrl}/tasks`);
  }

  getResources(): Observable<ResourceItem[]> {
    return this.http.get<ResourceItem[]>(`${this.apiUrl}/resources`);
  }

  getDashboard(): Observable<{ tasks: TaskItem[]; resources: ResourceItem[] }> {
    return this.http.get<{ tasks: TaskItem[]; resources: ResourceItem[] }>(`${this.apiUrl}/dashboard`);
  }
}
