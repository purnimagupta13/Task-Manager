import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  register(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // ✅ 1. Check all fields
    if (!this.firstName.trim() || !this.lastName.trim() || !this.email.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      this.errorMessage = 'All fields are required!';
      return;
    }

    // ✅ 2. Email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address!';
      return;
    }

    // ✅ 3. Password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // ✅ 4. Email duplication check
    const usersData = localStorage.getItem('users');
    const users = usersData ? JSON.parse(usersData) : [];
    const existingUser = users.find((u: any) => u.email.toLowerCase() === this.email.toLowerCase());
    if (existingUser) {
      this.errorMessage = 'Email already registered!';
      return;
    }

    // ✅ 5. Call AuthService
    const registered = this.authService.register(this.email, this.password, this.firstName, this.lastName);
    if (registered) {
      this.successMessage = 'Registration successful! Redirecting to login...';
      setTimeout(() => this.router.navigate(['/login']), 1500);
    } else {
      this.errorMessage = 'Something went wrong. Please try again.';
    }
  }
}
