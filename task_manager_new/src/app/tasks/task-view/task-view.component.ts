import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
  standalone: false
})
export class TaskViewComponent implements OnInit {
  task?: Task;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.task = this.taskService.getTaskById(id);

    if (!this.task) {
      // If the user navigates to an invalid id, go back to list
      alert('Task not found.');
      this.router.navigate(['/tasks']);
    }
  }

  onEdit(): void {
    if (!this.task) return;
    this.router.navigate(['/task-form'], { queryParams: { editId: this.task.id } });
  }

  onDelete(): void {
    if (!this.task) return;
    const confirmed = confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      this.taskService.deleteTask(this.task.id);
      this.router.navigate(['/tasks']);
    }
  }
}
