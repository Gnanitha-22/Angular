import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header" *ngIf="!isCollapsed">
        <h3>Menu</h3>
        <button class="collapse-btn" (click)="toggleCollapse()">⟨</button>
      </div>
      <button class="collapse-btn mobile" *ngIf="isCollapsed" (click)="toggleCollapse()">⟩</button>
      
      <nav class="nav-menu">
        <a *ngFor="let item of navItems" 
           [routerLink]="item.route" 
           routerLinkActive="active"
           [routerLinkActiveOptions]="{exact: true}"
           class="nav-item"
           [attr.title]="isCollapsed ? item.label : null">
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label" *ngIf="!isCollapsed">{{ item.label }}</span>
        </a>
      </nav>

      <div class="sidebar-footer" *ngIf="!isCollapsed">
        <div class="footer-section">
          <p class="footer-title">Need Help?</p>
          <a href="#" class="help-link">📖 Documentation</a>
          <a href="#" class="help-link">💬 Support</a>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--sidebar-bg);
      color: var(--text-primary);
      padding: 20px 0;
      min-height: calc(100vh - 64px);
      transition: width 0.3s ease;
      border-right: 1px solid rgba(255,255,255,0.08);
      position: relative;
      overflow-y: auto;
    }
    .sidebar.collapsed {
      width: 80px;
    }
    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      margin-bottom: 16px;
    }
    .sidebar-header h3 {
      margin: 0;
      font-size: 0.9rem;
      text-transform: uppercase;
      color: #94a3b8;
      letter-spacing: 0.5px;
    }
    .collapse-btn {
      background: none;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .collapse-btn:hover {
      background: rgba(255,255,255,0.08);
    }
    .collapse-btn.mobile {
      display: none;
      margin: 0 auto 16px;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 0 12px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #cbd5e1;
      text-decoration: none;
      padding: 12px 12px;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      cursor: pointer;
      position: relative;
    }
    .nav-item:hover {
      background: rgba(37, 99, 235, 0.1);
      color: #93c5fd;
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0.05) 100%);
      color: #60a5fa;
      border-left: 3px solid #2563eb;
      padding-left: 9px;
    }
    .nav-icon {
      font-size: 1.2rem;
      min-width: 24px;
    }
    .nav-label {
      white-space: nowrap;
    }
    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px 12px;
      border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.2);
    }
    .footer-section {
      font-size: 0.85rem;
    }
    .footer-title {
      margin: 0 0 8px;
      color: #94a3b8;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
    }
    .help-link {
      display: block;
      color: #cbd5e1;
      text-decoration: none;
      padding: 6px 8px;
      border-radius: 6px;
      margin-bottom: 4px;
      transition: background 0.2s;
    }
    .help-link:hover {
      background: rgba(255,255,255,0.08);
      color: #93c5fd;
    }
    ::-webkit-scrollbar {
      width: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.15);
    }
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 64px;
        height: calc(100vh - 64px);
        z-index: 99;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
      }
      .sidebar.active {
        transform: translateX(0);
      }
      .collapse-btn.mobile {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .sidebar-header {
        display: none;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() userRole: string = 'Admin';
  
  isCollapsed = false;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: '📊', route: '/dashboard' },
    { label: 'Users', icon: '👥', route: '/users', roles: ['Admin'] },
    { label: 'Projects', icon: '📁', route: '/projects', roles: ['Admin', 'Project Manager'] },
    { label: 'Tasks', icon: '✓', route: '/tasks', roles: ['Admin', 'Project Manager', 'Team Member'] },
    { label: 'Resources', icon: '👨‍💼', route: '/resources', roles: ['Admin', 'Project Manager'] },
    { label: 'Reports', icon: '📈', route: '/reports', roles: ['Admin'] }
  ];

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
