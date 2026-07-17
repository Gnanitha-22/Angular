import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;
      if (!value) return null;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecial = /[!@#\$%\^&\*]/.test(value);
      const valid = hasUpper && hasLower && hasNumber && hasSpecial && value.length >= 8;
      return valid ? null : { passwordStrength: true };
    };
  }

  static matchFields(fieldA: string, fieldB: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const fg = group as FormGroup;
      const a = fg.controls[fieldA];
      const b = fg.controls[fieldB];
      if (!a || !b) return null;
      return a.value === b.value ? null : { fieldsMismatch: { fieldA, fieldB } };
    };
  }

  static pattern(pattern: RegExp, errorKey = 'pattern'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      return pattern.test(control.value) ? null : { [errorKey]: true };
    };
  }
}

export default CustomValidators;
