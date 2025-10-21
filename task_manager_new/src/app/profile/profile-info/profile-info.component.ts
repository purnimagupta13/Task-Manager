import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css'],
  standalone: false
})
export class ProfileInfoComponent implements OnInit {
  userData = {
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  };
  message = '';
  isError = false;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const currentUserRaw = localStorage.getItem('currentUser');
    const usersRaw = localStorage.getItem('users');
    if (!currentUserRaw || !usersRaw) return;

    const currentUser = JSON.parse(currentUserRaw);
    const users = JSON.parse(usersRaw);

    const match = users.find((u: any) => u.email === currentUser.email);
    if (match) {
      this.userData = {
        email: match.email,
        firstName: match.firstName || '',
        lastName: match.lastName || '',
        phone: match.phone || '',
        address: match.address || ''
      };
    }
  }

  saveProfile(): void {
    const usersRaw = localStorage.getItem('users');
    if (!usersRaw) return;

    const users = JSON.parse(usersRaw);
    const idx = users.findIndex((u: any) => u.email === this.userData.email);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...this.userData };
      localStorage.setItem('users', JSON.stringify(users));

      // Update currentUser as well
      localStorage.setItem('currentUser', JSON.stringify(users[idx]));
      this.message = 'Profile updated successfully!';
      this.isError = false;
    } else {
      this.message = 'User not found!';
      this.isError = true;
    }
  }

  resetForm(): void {
    this.loadUserData();
    this.message = '';
  }
}
