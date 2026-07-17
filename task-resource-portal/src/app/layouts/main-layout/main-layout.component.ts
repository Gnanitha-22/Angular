import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { BreadcrumbComponent } from '../../shared/components/breadcrumb/breadcrumb.component';
import { GlobalLoaderComponent } from '../../shared/components/global-loader/global-loader.component';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, BreadcrumbComponent, GlobalLoaderComponent],
  template: `
    <div class="app-shell">
      <app-header></app-header>
      <app-global-loader></app-global-loader>
      <div class="content-area">
        <app-sidebar #sidebar></app-sidebar>
        <div class="main-content-wrapper">
          <app-breadcrumb></app-breadcrumb>
          <main class="main-panel">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-shell {
      min-height: 100vh;
      background: var(--bg-primary);
      display: flex;
      flex-direction: column;
      transition: background-color 0.3s ease;
    }
    .content-area {
      display: flex;
      flex: 1;
    }
    .main-content-wrapper {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }
    .main-panel {
      flex: 1;
      padding: 24px;
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }
    @media (max-width: 768px) {
      .content-area {
        flex-direction: column;
      }
      .main-panel {
        padding: 16px;
      }
    }
  `]
})
export class MainLayoutComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;

  constructor(private themeService: ThemeService) {
    // Theme is already initialized in ThemeService
  }
}

