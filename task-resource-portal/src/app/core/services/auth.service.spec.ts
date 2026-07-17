import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { SecureStorageService } from './secure-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let storage: SecureStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [RouterTestingModule], providers: [SecureStorageService] });
    service = TestBed.inject(AuthService);
    storage = TestBed.inject(SecureStorageService);
  });

  it('should create token and validate it', (done) => {
    service.login('admin@portal.com', 'password123', false).subscribe(user => {
      expect(user).toBeTruthy();
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.isTokenValid()).toBeTrue();
      done();
    });
  });
});
