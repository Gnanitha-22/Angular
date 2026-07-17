import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../../models';

const DUMMY_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', department: 'Engineering', status: 'Active', joinDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Project Manager', department: 'Product', status: 'Active', joinDate: '2023-02-20' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Team Member', department: 'Engineering', status: 'Active', joinDate: '2023-03-10' },
  { id: 4, name: 'Sarah Williams', email: 'sarah.williams@example.com', role: 'Project Manager', department: 'Design', status: 'Active', joinDate: '2023-04-05' },
  { id: 5, name: 'Robert Brown', email: 'robert.brown@example.com', role: 'Team Member', department: 'Engineering', status: 'On Leave', joinDate: '2023-05-12' },
  { id: 6, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Admin', department: 'Operations', status: 'Active', joinDate: '2023-01-25' },
  { id: 7, name: 'David Miller', email: 'david.miller@example.com', role: 'Team Member', department: 'Engineering', status: 'Active', joinDate: '2023-06-08' },
  { id: 8, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', role: 'Project Manager', department: 'Finance', status: 'Inactive', joinDate: '2023-02-18' }
];

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>(DUMMY_USERS);
  users$ = this.usersSubject.asObservable();

  constructor(private api: ApiService) {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.api.getAll<User>('users').pipe(
      catchError(() => {
        // If API fails, use dummy data
        return of(DUMMY_USERS);
      })
    ).subscribe({
      next: users => this.usersSubject.next(users && users.length > 0 ? users : DUMMY_USERS),
      error: () => this.usersSubject.next(DUMMY_USERS)
    });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  addUser(user: Omit<User, 'id'>): void {
    this.api.create<User>('users', user).subscribe({
      next: newUser => this.usersSubject.next([...this.getUsersSync(), newUser]),
      error: () => {}
    });
  }

  updateUser(id: number, user: Partial<User>): void {
    this.api.update<User>('users', id, user).subscribe({
      next: updated => {
        const users = this.getUsersSync().map(item => item.id === id ? updated : item);
        this.usersSubject.next(users);
      },
      error: () => {}
    });
  }

  deleteUser(id: number): void {
    this.api.delete('users', id).subscribe({
      next: () => this.usersSubject.next(this.getUsersSync().filter(item => item.id !== id)),
      error: () => {}
    });
  }

  getUserById(id: number): User | undefined {
    return this.getUsersSync().find(u => u.id === id);
  }

  setUsers(users: User[]): void {
    this.usersSubject.next(users);
  }

  private getUsersSync(): User[] {
    return this.usersSubject.getValue();
  }
}
