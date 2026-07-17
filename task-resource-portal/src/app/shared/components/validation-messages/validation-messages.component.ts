import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="control">
      <div class="validation-message" *ngIf="control.touched || control.dirty">
        <div *ngIf="control.hasError('required')">This field is required.</div>
        <div *ngIf="control.hasError('email')">Please enter a valid email address.</div>
        <div *ngIf="control.hasError('minlength')">Minimum length not met.</div>
        <div *ngIf="control.hasError('maxlength')">Maximum length exceeded.</div>
        <div *ngIf="control.hasError('pattern')">Invalid format.</div>
        <div *ngIf="control.hasError('passwordStrength')">Password must be at least 8 chars and include upper, lower, number and special char.</div>
        <div *ngIf="control.hasError('fieldsMismatch')">Fields do not match.</div>
      </div>
    </ng-container>
  `,
  styles: [`.validation-message { color: #c62828; font-size: 12px; margin-top: 6px; }`]
})
export class ValidationMessagesComponent {
  @Input() control!: AbstractControl | null;
}
