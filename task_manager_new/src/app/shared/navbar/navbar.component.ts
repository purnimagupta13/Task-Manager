import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/authorization.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {
  isAdmin = false;
  userFirstName: string | null = null;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.updateUserData();

    // Refresh greeting whenever navigation completes (e.g., after login redirect)
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(() => this.updateUserData());
  }

  private updateUserData(): void {
    const currentUserRaw = localStorage.getItem('currentUser');
    if (currentUserRaw) {
      const cu = JSON.parse(currentUserRaw);
      // Prefer firstName; if missing, show email name part as a friendly fallback
      this.userFirstName = cu.firstName && cu.firstName.trim()
        ? cu.firstName
        : (cu.email ? (cu.email.split('@')[0] || null) : null);

      this.isAdmin = cu.role === 'admin' || cu.role === 'Admin';
    } else {
      this.userFirstName = null;
      this.isAdmin = false;
    }
  }

  logout(): void {
    this.authService.logout();
    this.userFirstName = null;
    this.isAdmin = false;
  }
}
