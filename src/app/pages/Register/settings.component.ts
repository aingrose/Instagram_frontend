import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators,AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
    imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  form!: FormGroup ;
   errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      this.form.markAllAsTouched(); // Mark all fields as touched to show errors
      return;
    }
  
    this.errorMessage = ''; // Clear error message if form is valid
    const { confirmPassword, ...formData } = this.form.value;
    
    this.authService.register(formData).subscribe({
      next: (response: any) => {
        console.log('User registered:', response);
        alert('Registration successful! Please login.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Registration failed:', err);
        this.errorMessage = err?.error?.message || 'Registration failed. Please try again.';
      }
    })
  }
  

  onReset() {
    this.form.reset();
  }
}
