import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../models/user-role.enum';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';

  constructor(private router: Router) {
    this.ensureAdminExists();
  }

  // 🔸 create default admin if not present
  private ensureAdminExists(): void {
    const users = this.getUsers();
    const adminExists = users.some(u => u.email === 'Purnima@angular.com');
    if (!adminExists) {
      users.push({
        firstName: 'Purnima',
        lastName: 'Gupta',
        email: 'Purnima@angular.com',
        password: 'Purnima@123',
        role: UserRole.Admin
      });
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
  }

  private getUsers(): User[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  register(email: string, password: string, firstName: string, lastName: string): boolean {
    const users = this.getUsers();
    if (users.some(u => u.email === email)) return false;

    users.push({ firstName, lastName, email, password, role: UserRole.RegularUser });
    this.saveUsers(users);
    return true;
  }


  login(email: string, password: string): boolean {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      // Fallbacks in case first/last names were not present in older records
      const safeUser = {
        firstName: (user as any).firstName || '',
        lastName: (user as any).lastName || '',
        email: user.email,
        password: user.password,
        role: user.role
      };
      localStorage.setItem(this.currentUserKey, JSON.stringify(safeUser));
      return true;
    }
    return false;
  }


  logout(): void {
    localStorage.removeItem(this.currentUserKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(this.currentUserKey);
    return data ? JSON.parse(data) : null;
  }

  getCurrentUserRole(): UserRole | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  resetPasswordByEmail(email: string, currentPassword: string, newPassword: string): boolean {
    const usersRaw = localStorage.getItem('users');
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const idx = users.findIndex((u: any) => (u.email || '').toLowerCase() === email.toLowerCase());
    if (idx === -1) return false;

    // verify current password
    if (users[idx].password !== currentPassword) return false;

    users[idx].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // also refresh currentUser if the same user happens to be logged in
    const cuRaw = localStorage.getItem('currentUser');
    if (cuRaw) {
      const cu = JSON.parse(cuRaw);
      if ((cu.email || '').toLowerCase() === email.toLowerCase()) {
        cu.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(cu));
      }
    }

    return true;
  }
}
