import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  editingEmail: string | null = null;

  // simple edit model
  editData = { firstName: '', lastName: '', phone: '', address: '' };

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users = this.userService.getAllUsers();
  }

  startEdit(u: any): void {
    this.editingEmail = u.email;
    this.editData = {
      firstName: u.firstName || '',
      lastName: u.lastName || '',
      phone: u.phone || '',
      address: u.address || ''
    };
  }

  cancelEdit(): void {
    this.editingEmail = null;
    this.editData = { firstName: '', lastName: '', phone: '', address: '' };
  }

  saveEdit(): void {
    if (!this.editingEmail) return;
    this.userService.updateUser(this.editingEmail, this.editData);
    this.cancelEdit();
    this.loadUsers();
  }

  deleteUser(email: string): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const ok = this.userService.deleteUser(email);
    if (!ok) {
      alert('Cannot delete admin user.');
      return;
    }
    this.loadUsers();
  }
}
