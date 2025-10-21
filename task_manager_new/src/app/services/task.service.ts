import { Injectable } from '@angular/core';
import { AuthService } from './authorization.service';
import { TaskPriority } from '../models/task-priority.enum';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  createdBy: string;
  createdAt: string;
}

interface ActivityItem {
  user: string;
  action: string;
  timestamp: string; // ISO
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksKey = 'tasks';
  private activityKey = 'activityLogs';

  constructor(private authService: AuthService) { }

  // ===== tasks =====
  private getAllTasksFromStorage(): Task[] {
    const data = localStorage.getItem(this.tasksKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllTasks(tasks: Task[]): void {
    localStorage.setItem(this.tasksKey, JSON.stringify(tasks));
  }

  getUserTasks(): Task[] {
    const user = this.authService.getCurrentUser();
    const tasks = this.getAllTasksFromStorage();
    return user ? tasks.filter(t => t.createdBy === user.email) : [];
  }

  getTaskById(id: number): Task | undefined {
    const tasks = this.getAllTasksFromStorage();
    return tasks.find(t => t.id === id);
  }

  addTask(task: Task): void {
    const tasks = this.getAllTasksFromStorage();
    task.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
    task.createdAt = new Date().toISOString();
    const user = this.authService.getCurrentUser();
    if (user) task.createdBy = user.email;
    tasks.push(task);
    this.saveAllTasks(tasks);
    this.logActivity(task.createdBy, 'created task');
  }

  updateTask(updatedTask: Task): void {
    const tasks = this.getAllTasksFromStorage();
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      this.saveAllTasks(tasks);
      this.logActivity(updatedTask.createdBy, 'updated task');
    }
  }

  deleteTask(id: number): void {
    const tasks = this.getAllTasksFromStorage();
    const toDelete = tasks.find(t => t.id === id);
    const updatedTasks = tasks.filter(t => t.id !== id);
    this.saveAllTasks(updatedTasks);
    if (toDelete) this.logActivity(toDelete.createdBy, 'deleted task');
  }

  getAllTasks(): Task[] {
    return this.getAllTasksFromStorage();
  }

  // ===== activity =====
  private getAllActivities(): ActivityItem[] {
    const data = localStorage.getItem(this.activityKey);
    return data ? JSON.parse(data) : [];
  }

  private saveAllActivities(list: ActivityItem[]): void {
    localStorage.setItem(this.activityKey, JSON.stringify(list));
  }

  private logActivity(userEmail: string, action: string): void {
    const list = this.getAllActivities();
    list.unshift({ user: userEmail, action, timestamp: new Date().toISOString() });
    // keep only latest 50 to avoid bloat
    this.saveAllActivities(list.slice(0, 50));
  }

  getRecentActivity(limit: number = 5): ActivityItem[] {
    return this.getAllActivities().slice(0, limit);
  }
}
