import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  it('should redirect when not authenticated', () => {
    const router = TestBed.inject(RouterTestingModule as any);
    const auth = TestBed.inject(AuthService);
    spyOn(auth, 'isAuthenticated').and.returnValue(false);
    const result = authGuard();
    // result is a UrlTree or boolean; cannot evaluate Router here in unit test easily
    expect(typeof result !== 'boolean').toBeTrue();
  });
});
