import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = performance.now();
  return next(req).pipe(
    tap({
      next: event => {
        const elapsed = Math.round(performance.now() - started);
        console.debug(`API Request: ${req.method} ${req.urlWithParams} [${elapsed}ms]`);
      }
    })
  );
};
