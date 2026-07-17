import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;

  show(): void {
    this.activeRequests += 1;
    console.debug('[Loader] show -> activeRequests=', this.activeRequests);
    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
      // safety: force-hide after 30s to avoid stale spinner in dev
      setTimeout(() => {
        if (this.activeRequests > 0) {
          console.warn('[Loader] safety timeout triggered, forcing hide');
          this.activeRequests = 0;
          this.loadingSubject.next(false);
        }
      }, 30000);
    }
  }

  hide(): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    console.debug('[Loader] hide -> activeRequests=', this.activeRequests);
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }

  getActiveRequests(): number {
    return this.activeRequests;
  }
}
