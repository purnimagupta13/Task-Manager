import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  standalone: false
})
export class ForgotPasswordComponent {
  email = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isError = false;

  constructor(private authService: AuthService, private router: Router) { }

  changePassword(): void {
    this.message = '';
    this.isError = false;

    if (!this.email.trim() || !this.currentPassword.trim() || !this.newPassword.trim() || !this.confirmPassword.trim()) {
      this.message = 'All fields are required!';
      this.isError = true;
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.email)) {
      this.message = 'Please enter a valid email address!';
      this.isError = true;
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New passwords do not match!';
      this.isError = true;
      return;
    }

    const ok = this.authService.resetPasswordByEmail(this.email, this.currentPassword, this.newPassword);
    if (ok) {
      this.message = 'Password changed successfully! Please login.';
      this.isError = false;
      setTimeout(() => this.router.navigate(['/login']), 1200);
    } else {
      this.message = 'Email or current password is incorrect.';
      this.isError = true;
    }
  }
}
