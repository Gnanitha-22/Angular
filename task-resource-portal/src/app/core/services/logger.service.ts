import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  debug(...args: any[]) { console.debug('[DEBUG]', ...args); }
  info(...args: any[]) { console.info('[INFO]', ...args); }
  warn(...args: any[]) { console.warn('[WARN]', ...args); }
  error(...args: any[]) { console.error('[ERROR]', ...args); }
}
