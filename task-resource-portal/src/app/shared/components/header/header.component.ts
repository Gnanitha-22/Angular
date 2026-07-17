import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { AppStateService } from '../../../core/services/app-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="topbar">
      <div class="header-left">
        <div class="brand">
          <span class="logo-icon">📊</span>
          <span class="brand-name">Enterprise Portal</span>
        </div>
      </div>
      <div class="header-center">
        <input type="search" class="search-box" placeholder="Search..." />
      </div>
      <div class="header-right">
        <button class="theme-toggle-btn" (click)="toggleTheme()" [title]="(theme$ | async) === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'">
          {{ (theme$ | async) === 'light' ? '🌙' : '☀️' }}
        </button>
        <div class="profile-menu" [class.open]="profileOpen">
            <ng-container *ngIf="auth$ | async as current">
              <button class="profile-btn" (click)="toggleProfile()">
                <span class="avatar">{{ current.email.charAt(0).toUpperCase() }}</span>
                <span class="user-name">{{ current.email.split('@')[0] }}</span>
                <span class="dropdown-icon">▼</span>
              </button>
              <div class="profile-dropdown" *ngIf="profileOpen">
                    <div class="profile-header">
                      <div class="avatar-large">{{ current.email.charAt(0).toUpperCase() }}</div>
                      <div>
                        <p class="profile-email">{{ current.email }}</p>
                        <p class="profile-role">{{ current.role }}</p>
                      </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item">👤 My Profile</a>
                    <a href="#" class="dropdown-item">⚙️ Settings</a>
                    <a href="#" class="dropdown-item">🔔 Notifications</a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout" (click)="logout()">🚪 Logout</button>
                  </div>
                </ng-container>
            </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      background: var(--header-bg);
      color: #fff;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header-left { flex: 0 0 auto; }
    .header-center { flex: 1; margin: 0 24px; }
    .header-right { flex: 0 0 auto; }
    .brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
    .logo-icon { font-size: 1.5rem; }
    .brand-name { background: linear-gradient(135deg, #fff, #cbd5e1); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .search-box { width: 100%; max-width: 400px; padding: 8px 14px; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; background: rgba(255,255,255,0.1); color: white; font-size: 0.9rem; }
    .search-box::placeholder { color: rgba(255,255,255,0.6); }
    .profile-btn { border: none; background: none; color: white; display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 6px 12px; border-radius: 8px; }
    .profile-btn:hover { background: rgba(255,255,255,0.1); }
    .theme-toggle-btn { border: none; background: rgba(255,255,255,0.1); color: white; cursor: pointer; padding: 8px 12px; border-radius: 8px; font-size: 1.1rem; margin-right: 12px; transition: background 0.2s; display: flex; align-items: center; justify-content: center; }
    .theme-toggle-btn:hover { background: rgba(255,255,255,0.2); }
    .avatar { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.2); font-weight: 700; font-size: 0.85rem; }
    .user-name { font-size: 0.9rem; }
    .dropdown-icon { font-size: 0.7rem; transition: transform 0.2s; }
    .profile-menu.open .dropdown-icon { transform: rotate(180deg); }
    .profile-menu { position: relative; }
    .profile-dropdown { position: absolute; top: 100%; right: 0; width: 280px; background: white; color: #1f2937; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); margin-top: 8px; overflow: hidden; animation: slideDown 0.2s ease; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .profile-header { padding: 16px; display: flex; gap: 12px; align-items: center; background: #f3f4f6; }
    .avatar-large { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
    .profile-email { margin: 0; font-size: 0.95rem; font-weight: 600; }
    .profile-role { margin: 4px 0 0; font-size: 0.8rem; color: #6b7280; }
    .dropdown-divider { height: 1px; background: #e5e7eb; }
    .dropdown-item { display: block; width: 100%; padding: 12px 16px; text-align: left; border: none; background: none; color: #374151; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; }
    .dropdown-item:hover { background: #f3f4f6; }
    .dropdown-item.logout { color: #dc2626; }
    .dropdown-item.logout:hover { background: #fee2e2; }
    @media (max-width: 768px) {
      .header-center { display: none; }
      .brand-name { display: none; }
      .user-name { display: none; }
      .topbar { padding: 0 16px; }
    }
  `]
})
export class HeaderComponent {
  profileOpen = false;
  auth$: Observable<any> | null = null;
  theme$: Observable<'light' | 'dark'>;

  constructor(private appState: AppStateService, private themeService: ThemeService) {
    this.auth$ = this.appState.auth$;
    this.theme$ = this.themeService.theme$;
  }

  toggleProfile(): void {
    this.profileOpen = !this.profileOpen;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.profileOpen = false;
    this.appState.logout();
  }
}
