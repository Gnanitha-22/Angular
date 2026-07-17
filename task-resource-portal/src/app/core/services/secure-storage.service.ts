import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SecureStorageService {
  private prefix = 'portal_';

  set(key: string, value: string, persistent = false): void {
    const k = this.prefix + key;
    try {
      if (persistent) {
        localStorage.setItem(k, value);
      } else {
        sessionStorage.setItem(k, value);
      }
    } catch (e) {
      // fall back to in-memory or no-op
      console.warn('SecureStorage: storage unavailable', e);
    }
  }

  get(key: string): string | null {
    const k = this.prefix + key;
    return sessionStorage.getItem(k) || localStorage.getItem(k);
  }

  remove(key: string): void {
    const k = this.prefix + key;
    sessionStorage.removeItem(k);
    localStorage.removeItem(k);
  }
}
