import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-global-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="global-loader" *ngIf="loader.loading$ | async">
      <mat-progress-spinner mode="indeterminate" diameter="60"></mat-progress-spinner>
    </div>
  `,
  styles: [
    `
      .global-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: grid;
        place-items: center;
        background: rgba(15, 23, 42, 0.32);
        z-index: 2000;
      }
    `
  ]
})
export class GlobalLoaderComponent {
  loader = inject(LoaderService);
}
