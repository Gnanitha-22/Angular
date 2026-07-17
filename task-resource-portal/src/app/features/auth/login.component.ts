import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/services/app-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-shell">
      <form [formGroup]="form" (ngSubmit)="submit()" class="login-card">
        <h2>Sign in</h2>
        <p>Access your enterprise workspace</p>

        <label>Email</label>
        <input type="email" formControlName="email" placeholder="admin@portal.com" />

        <label>Password</label>
        <input type="password" formControlName="password" placeholder="password123" />

        <div class="remember-wrapper">
          <input type="checkbox" id="rememberMe" formControlName="rememberMe" />
          <label for="rememberMe">Remember me</label>
        </div>

        <button type="submit" [disabled]="form.invalid || loading">{{ loading ? 'Signing in...' : 'Login' }}</button>
        <p class="error" *ngIf="error">{{ error }}</p>
        <p class="hint">Try admin&#64;portal.com / password123</p>
      </form>
    </div>
  `,
  styles: [
    `.login-shell { min-height: 100vh; display: grid; place-items: center; background: linear-gradient(135deg, #0f172a, #1d4ed8); }`,
    `.login-card { background: white; padding: 32px; border-radius: 16px; width: min(100%, 420px); box-shadow: 0 20px 45px rgba(0,0,0,0.2); }`,
    `label { display:block; margin-top: 12px; font-weight: 600; }`,
    `input[type="text"], input[type="password"], input[type="email"] { width: 100%; padding: 10px 12px; margin-top: 6px; border: 1px solid #cbd5e1; border-radius: 8px; box-sizing: border-box; }`,
    `.remember-wrapper { display:flex; align-items:center; gap:8px; margin: 16px 0; }`,
    `.remember-wrapper input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }`,
    `.remember-wrapper label { margin: 0; font-weight: 500; cursor: pointer; }`,
    `button { width: 100%; margin-top: 12px; padding: 10px 12px; border: none; border-radius: 8px; background:#2563eb; color:white; font-weight:700; cursor:pointer; }`,
    `button[disabled] { opacity:0.7; cursor:not-allowed; }`,
    `.error { color: #dc2626; margin-top: 10px; }`,
    `.hint { color: #64748b; font-size: 0.9rem; margin-top: 10px; }`
  ]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private appState: AppStateService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    const { email, password, rememberMe } = this.form.value;

    this.appState.login(email, password, rememberMe).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.error = 'Invalid email or password.';
        this.loading = false;
      }
    });
  }
}
