import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  // header stats
  totalUsers = 0;
  totalTasks = 0;

  // recent activity (top-right card)
  recentActivity: { user: string; action: string; timestamp: number | string | Date }[] = [];

  // user management
  users: any[] = [];
  page = 1;
  pageSize = 3;

  // edit modal state
  showEdit = false;
  editEmail: string | null = null;
  editModel: { firstName?: string; lastName?: string; phone?: string; address?: string } = {};
  feedbackMsg = '';                    // transient dashboard message (e.g., cannot delete admin)

  constructor(
    private taskService: TaskService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.refreshHeader();
    this.loadUsers();

    // recent activity (3 only)
    if (typeof (this.taskService as any).getRecentActivity === 'function') {
      try {
        const result = (this.taskService as any).getRecentActivity(3);
        this.recentActivity = Array.isArray(result) ? result.slice(0, 3) : [];
      } catch {
        this.recentActivity = [];
      }
    } else {
      this.recentActivity = [];
    }
  }

  // ----- header helpers -----
  private refreshHeader() {
    this.totalUsers = this.userService.getAllUsers().length;
    this.totalTasks = this.taskService.getAllTasks().length;
  }

  // ----- users + pagination -----
  private loadUsers() {
    this.users = this.userService.getAllUsers();
    this.ensurePageInRange();
  }

  get pagedUsers(): any[] {
    const start = (this.page - 1) * this.pageSize;
    return this.users.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.users.length / this.pageSize));
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  private ensurePageInRange(): void {
    const tp = this.totalPages;
    if (this.page > tp) this.page = tp;
    if (this.page < 1) this.page = 1;
  }

  // ----- edit flow -----
  openEdit(user: any): void {
    this.editEmail = user.email;
    this.editModel = {
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      phone: user.phone ?? '',
      address: user.address ?? ''
    };
    this.showEdit = true;
    this.feedbackMsg = '';
  }

  saveEdit(): void {
    if (!this.editEmail) return;
    this.userService.updateUser(this.editEmail, this.editModel);
    this.showEdit = false;
    this.editEmail = null;
    this.editModel = {};
    this.loadUsers();
    this.refreshHeader(); // in case the current user was edited (header welcome, etc.)
    this.feedbackMsg = 'User details updated.';
    setTimeout(() => (this.feedbackMsg = ''), 2500);
  }

  cancelEdit(): void {
    this.showEdit = false;
    this.editEmail = null;
    this.editModel = {};
  }

  // ----- delete flow -----
  deleteUser(email: string): void {
    const ok = confirm('Are you sure you want to delete this user?');
    if (!ok) return;

    const deleted = this.userService.deleteUser(email);
    if (!deleted) {
      this.feedbackMsg = 'Cannot delete the seeded admin account.';
      setTimeout(() => (this.feedbackMsg = ''), 2500);
      return;
    }

    this.loadUsers();
    this.refreshHeader();
    this.feedbackMsg = 'User deleted.';
    setTimeout(() => (this.feedbackMsg = ''), 2500);
  }
}
