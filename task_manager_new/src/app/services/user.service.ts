import { Injectable } from '@angular/core';
import { AuthService } from './authorization.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';
  private adminEmail = 'Kartik@angular.com';

  constructor(private authService: AuthService) { }

  private getAllUsersInternal(): any[] {
    const data = localStorage.getItem(this.usersKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllUsers(users: any[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  // ===== profile methods (existing) =====
  getCurrentUserProfile(): any {
    return this.authService.getCurrentUser();
  }

  updateCurrentUserProfile(profileData: any): void {
    const users = this.getAllUsersInternal();
    const current = this.authService.getCurrentUser();
    if (!current) return;
    const index = users.findIndex(u => u.email === current.email);
    if (index !== -1) {
      users[index] = { ...users[index], ...profileData };
      localStorage.setItem(this.currentUserKey, JSON.stringify(users[index]));
      this.saveAllUsers(users);
    }
  }

  changePassword(currentPass: string, newPass: string): boolean {
    const users = this.getAllUsersInternal();
    const current = this.authService.getCurrentUser();
    if (!current) return false;
    const index = users.findIndex(u => u.email === current.email);
    if (index !== -1 && users[index].password === currentPass) {
      users[index].password = newPass;
      localStorage.setItem(this.currentUserKey, JSON.stringify(users[index]));
      this.saveAllUsers(users);
      return true;
    }
    return false;
  }

  // ===== admin helpers =====
  getAllUsers(): any[] {
    return this.getAllUsersInternal();
  }

  updateUser(email: string, partial: any): void {
    const users = this.getAllUsersInternal();
    const idx = users.findIndex(u => u.email === email);
    if (idx !== -1) {
      // do not change email/role/password here from UI
      users[idx] = { ...users[idx], ...partial, email: users[idx].email, role: users[idx].role, password: users[idx].password };
      this.saveAllUsers(users);

      // if editing the currently logged-in user, refresh currentUser cache
      const current = this.authService.getCurrentUser();
      if (current && current.email === email) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(users[idx]));
      }
    }
  }

  deleteUser(email: string): boolean {
    if (email === this.adminEmail) return false; // cannot delete admin
    const users = this.getAllUsersInternal();
    const filtered = users.filter(u => u.email !== email);
    if (filtered.length !== users.length) {
      this.saveAllUsers(filtered);
      return true;
    }
    return false;
  }
}
