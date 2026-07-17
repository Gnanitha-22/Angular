import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SecureStorageService } from './secure-storage.service';

export interface AuthUser {
  email: string;
  role: 'Admin' | 'Project Manager' | 'Team Member';
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'portal-auth';
  private readonly tokenKey = 'portal-token';

  constructor(private router: Router, private storage: SecureStorageService) {}

  login(email: string, password: string, rememberMe: boolean): Observable<AuthUser> {
    // Trim whitespace from inputs
    email = email.trim();
    password = password.trim();

    const mockUsers: Record<string, AuthUser> = {
      'admin@portal.com': { email, role: 'Admin', token: this.createToken('Admin') },
      'pm@portal.com': { email, role: 'Project Manager', token: this.createToken('Project Manager') },
      'member@portal.com': { email, role: 'Team Member', token: this.createToken('Team Member') }
    };

    const user = mockUsers[email.toLowerCase()];
    if (!user || password !== 'password123') {
      return throwError(() => new Error('Invalid email or password'));
    }

    // store user info and token using SecureStorage wrapper
    this.storage.set(this.storageKey, JSON.stringify(user), rememberMe);
    this.storage.set(this.tokenKey, user.token, rememberMe);

    return of(user).pipe(delay(300));
  }

  logout(): void {
    this.storage.remove(this.storageKey);
    this.storage.remove(this.tokenKey);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): AuthUser | null {
    const raw = this.storage.get(this.storageKey);
    return raw ? JSON.parse(raw) as AuthUser : null;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return !!user && this.isTokenValid();
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === role;
  }

  /**
   * Decode a mock token of format mock-jwt.<payloadBase64>.<timestamp>
   */
  decodeToken(token: string | null): any {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 3) return null;
    try {
      const payload = atob(parts[1]);
      const ts = Number(parts[2]);
      return { payload, ts };
    } catch {
      return null;
    }
  }

  isTokenValid(): boolean {
    const token = this.storage.get(this.tokenKey);
    const decoded = this.decodeToken(token);
    if (!decoded) return false;
    const now = Date.now();
    // consider token valid for 24 hours from creation in this mock
    return now - decoded.ts < 24 * 60 * 60 * 1000;
  }

  private createToken(role: string): string {
    return `mock-jwt.${btoa(role)}.${Date.now()}`;
  }
}
