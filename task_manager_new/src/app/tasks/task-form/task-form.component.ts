import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TaskService } from '../../services/task.service';
import { TaskPriority } from '../../models/task-priority.enum';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
  standalone: false
})
export class TaskFormComponent implements OnInit {
  // ✅ set enum-based default
  task: Task = {
    id: 0,
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.Medium, // ← use enum, not plain string
    createdBy: '',
    createdAt: ''
  };

  editMode = false;

  // ✅ expose enum and list to template
  taskPriority = TaskPriority;
  priorityOptions = Object.values(TaskPriority); // ['Low','Medium','High']

  constructor(
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const editId = this.route.snapshot.queryParams['editId'];
    if (editId) {
      const found = this.taskService.getTaskById(Number(editId));
      if (found) {
        this.task = { ...found };
        this.editMode = true;
      }
    }
  }

  saveTask(): void {
    if (this.editMode) {
      this.taskService.updateTask(this.task);
    } else {
      this.taskService.addTask(this.task);
    }

    this.router.navigate(['/tasks']);
  }
}
