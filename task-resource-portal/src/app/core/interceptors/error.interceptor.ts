import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AppStateService } from '../services/app-state.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const appState = inject(AppStateService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        appState.logout();
        router.navigate(['/login']);
      }
      const friendly = getFriendlyMessage(err);
      notificationService.error(friendly);
      return throwError(() => err);
    })
  );
};

function getFriendlyMessage(error: HttpErrorResponse): string {
  if (!navigator.onLine) return 'No internet connection. Please check your network settings.';
  switch (error.status) {
    case 0:
      return 'Cannot connect to the API server. Please verify JSON Server is running.';
    case 400:
      return 'Request was malformed. Please try again.';
    case 401:
      return 'You are not authorized. Please log in again.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'Requested data could not be found.';
    case 500:
      return 'Server error occurred. Try again later.';
    default:
      return `Unexpected error: ${error.message}`;
  }
}
