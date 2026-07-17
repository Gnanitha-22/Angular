import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute, RouterLink } from '@angular/router';
import { filter, map } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  route: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb-container" *ngIf="breadcrumbs.length > 0">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="/">🏠 Home</a>
        </li>
        <li *ngFor="let crumb of breadcrumbs" class="breadcrumb-item" [class.active]="crumb === breadcrumbs[breadcrumbs.length - 1]">
          <span *ngIf="crumb === breadcrumbs[breadcrumbs.length - 1]">{{ crumb.label }}</span>
          <a *ngIf="crumb !== breadcrumbs[breadcrumbs.length - 1]" [routerLink]="crumb.route">{{ crumb.label }}</a>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      padding: 12px 0;
      border-bottom: 1px solid #e5e7eb;
      background: #ffffff;
    }
    .breadcrumb {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .breadcrumb-item {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
    }
    .breadcrumb-item:not(:last-child)::after {
      content: '/';
      margin: 0 8px;
      color: #cbd5e1;
    }
    .breadcrumb-item a {
      color: #2563eb;
      text-decoration: none;
      transition: color 0.2s;
    }
    .breadcrumb-item a:hover {
      color: #1d4ed8;
      text-decoration: underline;
    }
    .breadcrumb-item.active {
      color: #6b7280;
      font-weight: 500;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.activatedRoute.root))
      )
      .subscribe(breadcrumbs => {
        this.breadcrumbs = breadcrumbs;
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet === 'primary') {
        const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');

        if (routeURL !== '') {
          url += `/${routeURL}`;
        }

        const label = child.snapshot.data[ROUTE_DATA_BREADCRUMB] || this.getLabelFromRoute(routeURL);
        if (label && url) {
          breadcrumbs.push({ label, route: url });
        }

        return this.buildBreadcrumbs(child, url, breadcrumbs);
      }
    }

    return breadcrumbs;
  }

  private getLabelFromRoute(route: string): string {
    const labels: { [key: string]: string } = {
      'dashboard': '📊 Dashboard',
      'users': '👥 Users',
      'projects': '📁 Projects',
      'tasks': '✓ Tasks',
      'resources': '👨‍💼 Resources',
      'reports': '📈 Reports'
    };
    return labels[route] || route.charAt(0).toUpperCase() + route.slice(1);
  }
}
