import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  standalone: false
})
export class ChangePasswordComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  isError = false;

  constructor(private userService: UserService) { }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.message = 'New passwords do not match!';
      this.isError = true;
      return;
    }

    const success = this.userService.changePassword(this.currentPassword, this.newPassword);
    if (success) {
      this.message = 'Password changed successfully!';
      this.isError = false;
      this.currentPassword = this.newPassword = this.confirmPassword = '';
    } else {
      this.message = 'Current password is incorrect!';
      this.isError = true;
    }
  }
}
