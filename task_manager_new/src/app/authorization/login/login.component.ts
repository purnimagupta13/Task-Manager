import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.errorMessage = '';

    // ✅ new validation
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Email and Password are required!';
      return;
    }

    const success = this.authService.login(this.email, this.password);
    if (success) {
      const role = this.authService.getCurrentUserRole();
      if (role === 'admin') this.router.navigate(['/admin/dashboard']);
      else this.router.navigate(['/tasks']);
    } else {
      this.errorMessage = 'Invalid email or password!';
    }
  }
}
