import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, retry, shareReplay } from 'rxjs';
import { API_CONFIG, ApiConfig } from '../config/api-config';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly config = inject(API_CONFIG) as ApiConfig;
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  getAll<T>(resource: string, params?: Record<string, string | number>): Observable<T[]> {
    const httpParams = params ? new HttpParams({ fromObject: this.normalizeParams(params) }) : undefined;
    const key = `${resource}?${JSON.stringify(params || {})}`;
    if (!this.cache.has(key)) {
      const req$ = this.http.get<T[]>(`${this.config.baseUrl}/${resource}`, { params: httpParams }).pipe(retry(1), shareReplay(1));
      this.cache.set(key, req$);
    }
    return this.cache.get(key) as Observable<T[]>;
  }

  get<T>(resource: string, params?: Record<string, string | number>): Observable<T> {
    const httpParams = params ? new HttpParams({ fromObject: this.normalizeParams(params) }) : undefined;
    const key = `${resource}?${JSON.stringify(params || {})}`;
    if (!this.cache.has(key)) {
      const req$ = this.http.get<T>(`${this.config.baseUrl}/${resource}`, { params: httpParams }).pipe(retry(1), shareReplay(1));
      this.cache.set(key, req$);
    }
    return this.cache.get(key) as Observable<T>;
  }

  getOne<T>(resource: string, id: number | string): Observable<T> {
    return this.http.get<T>(`${this.config.baseUrl}/${resource}/${id}`).pipe(retry(1));
  }

  create<T>(resource: string, payload: Omit<T, 'id'> | T): Observable<T> {
    this.clearCacheFor(resource);
    return this.http.post<T>(`${this.config.baseUrl}/${resource}`, payload);
  }

  update<T>(resource: string, id: number | string, payload: Partial<T>): Observable<T> {
    this.clearCacheFor(resource);
    return this.http.put<T>(`${this.config.baseUrl}/${resource}/${id}`, payload);
  }

  delete(resource: string, id: number | string): Observable<void> {
    this.clearCacheFor(resource);
    return this.http.delete<void>(`${this.config.baseUrl}/${resource}/${id}`);
  }

  private clearCacheFor(resource: string): void {
    const keys = Array.from(this.cache.keys()).filter(k => k.startsWith(resource));
    for (const k of keys) this.cache.delete(k);
  }

  private normalizeParams(params: Record<string, string | number>): Record<string, string> {
    return Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>);
  }
}
