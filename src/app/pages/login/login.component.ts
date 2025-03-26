
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form: FormGroup;
  errorMessage:string=""
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value).subscribe({
        next: (response) => {
          console.log('User logged in:', response);
          localStorage.setItem('accessToken', response.token);
          this.router.navigate(['/instagram']);
        },
        error: (err) => {
          console.error('Login failed:', err)
        this.errorMessage = err?.error?.message || 'Invalid email or password.';
        }
      });
    } else {
      console.log('Form not valid');
    }
  }

  get emailIsInvalid() {
    return this.form.get('email')?.touched && this.form.get('email')?.invalid;
  }

  get passwordIsInvalid() {
    return this.form.get('password')?.touched && this.form.get('password')?.invalid;
  }
}
