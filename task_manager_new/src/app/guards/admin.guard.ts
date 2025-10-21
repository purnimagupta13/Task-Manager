import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authorization.service';
import { UserRole } from '../models/user-role.enum';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const role = this.authService.getCurrentUserRole();
    if (role === UserRole.Admin) return true;
    this.router.navigate(['/tasks']);
    return false;
  }
}
