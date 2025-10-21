import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  standalone: false
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  sortedTasks: Task[] = [];
  // Sorting is now fixed to priority; no UI selector needed.
  // If you want Low→High instead, see the comment in sortByPriority().
  page = 1;
  pageSize = 3;

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks = this.taskService.getUserTasks();
    this.applyPrioritySort();
    this.ensurePageIsInRange();
  }

  private applyPrioritySort(): void {
    this.sortedTasks = this.sortByPriority(this.tasks);
  }

  private sortByPriority(list: Task[]): Task[] {
    // Map priority labels to weights. Higher number = higher priority.
    const weight: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

    // Default: High → Low (descending by weight). To switch to Low → High,
    // change (bWeight - aWeight) to (aWeight - bWeight).
    return [...list].sort((a, b) => {
      const aWeight = weight[a.priority] ?? 0;
      const bWeight = weight[b.priority] ?? 0;
      return bWeight - aWeight; // High → Low
    });
  }

  deleteTask(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
      this.loadTasks();
    }
  }

  get paginatedTasks(): Task[] {
    const start = (this.page - 1) * this.pageSize;
    return this.sortedTasks.slice(start, start + this.pageSize);
  }

  nextPage(): void {
    if (this.page * this.pageSize < this.sortedTasks.length) this.page++;
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  private ensurePageIsInRange(): void {
    const maxPage = Math.max(1, Math.ceil(this.sortedTasks.length / this.pageSize));
    if (this.page > maxPage) this.page = maxPage;
  }
}
