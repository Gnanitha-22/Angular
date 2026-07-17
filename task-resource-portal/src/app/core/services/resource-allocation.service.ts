import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { ProjectOption, ResourceAllocation, ResourceOption } from '../../models';

const DUMMY_ALLOCATIONS: ResourceAllocation[] = [
  { id: 1, userName: 'Mike Johnson', projectName: 'Mobile App Development', allocationPercent: 100, utilizationPercent: 92, status: 'Healthy' },
  { id: 2, userName: 'David Miller', projectName: 'Website Redesign', allocationPercent: 80, utilizationPercent: 75, status: 'Healthy' },
  { id: 3, userName: 'Mike Johnson', projectName: 'Cloud Migration', allocationPercent: 50, utilizationPercent: 60, status: 'Healthy' },
  { id: 4, userName: 'David Miller', projectName: 'Data Analytics Platform', allocationPercent: 120, utilizationPercent: 110, status: 'Overallocated' },
  { id: 5, userName: 'Robert Brown', projectName: 'Mobile App Development', allocationPercent: 100, utilizationPercent: 88, status: 'Healthy' },
  { id: 6, userName: 'Sarah Williams', projectName: 'API Integration', allocationPercent: 60, utilizationPercent: 55, status: 'Healthy' },
  { id: 7, userName: 'Mike Johnson', projectName: 'Database Optimization', allocationPercent: 30, utilizationPercent: 35, status: 'Healthy' },
  { id: 8, userName: 'David Miller', projectName: 'Security Audit', allocationPercent: 90, utilizationPercent: 85, status: 'Healthy' }
];

@Injectable({ providedIn: 'root' })
export class ResourceAllocationService {
  private allocationsSubject = new BehaviorSubject<ResourceAllocation[]>(DUMMY_ALLOCATIONS);
  allocations$ = this.allocationsSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadAllocations();
  }

  private loadAllocations(): void {
    this.api.getAll<ResourceAllocation>('allocations').pipe(
      catchError(() => {
        // If API fails, use dummy data
        return of(DUMMY_ALLOCATIONS);
      })
    ).subscribe({
      next: allocations => this.allocationsSubject.next(allocations && allocations.length > 0 ? allocations : DUMMY_ALLOCATIONS),
      error: () => this.allocationsSubject.next(DUMMY_ALLOCATIONS)
    });
  }

  getAllocations(): Observable<ResourceAllocation[]> {
    return this.allocations$;
  }

  getAllocationsSync(): ResourceAllocation[] {
    return this.allocationsSubject.getValue();
  }

  setAllocations(allocations: ResourceAllocation[]): void {
    this.allocationsSubject.next(allocations);
  }

  getUsers(): Observable<ResourceOption[]> {
    return this.api.getAll<ResourceOption>('users');
  }

  getProjects(): Observable<ProjectOption[]> {
    return this.api.getAll<ProjectOption>('projects');
  }

  addAllocation(allocation: Omit<ResourceAllocation, 'id' | 'status'>): void {
    const payload = {
      ...allocation,
      status: this.calculateStatus(allocation.allocationPercent)
    } as ResourceAllocation;

    this.api.create<ResourceAllocation>('allocations', payload).subscribe({
      next: newAllocation => this.allocationsSubject.next([...this.getAllocationsSync(), newAllocation]),
      error: () => {}
    });
  }

  updateAllocation(id: number, update: Partial<Omit<ResourceAllocation, 'id'>>): void {
    const current = this.getAllocationsSync().find(item => item.id === id);
    if (!current) {
      return;
    }

    const payload: ResourceAllocation = {
      ...current,
      ...update,
      status: this.calculateStatus(update.allocationPercent ?? current.allocationPercent)
    };

    this.api.update<ResourceAllocation>('allocations', id, payload).subscribe({
      next: updated => {
        const allocations = this.getAllocationsSync().map(item => item.id === id ? updated : item);
        this.allocationsSubject.next(allocations);
      },
      error: () => {}
    });
  }

  deleteAllocation(id: number): void {
    this.api.delete('allocations', id).subscribe({
      next: () => this.allocationsSubject.next(this.getAllocationsSync().filter(item => item.id !== id)),
      error: () => {}
    });
  }

  private calculateStatus(allocationPercent: number): ResourceAllocation['status'] {
    return allocationPercent > 100 ? 'Overallocated' : 'Healthy';
  }
}
