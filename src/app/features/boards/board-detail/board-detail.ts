import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';

// Services & Models
import { BoardService } from '../../../shared/services/board.service';
import { TaskService } from '../../../shared/services/task.service';
import { TranslationService } from '../../../shared/services/i18n/translation.service';
import { AppConfirmationService } from '../../../shared/services/confirmation.service';
import type { 
  BoardWithDetails, 
  Column, 
  Task, 
  TaskPriority, 
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest
} from '../../../shared/models';

interface ColumnWithTasks extends Column {
  tasks: Task[];
}

@Component({
  selector: 'app-board-detail',
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    ChipModule,
    ToastModule,
    SkeletonModule,
    TagModule,
    MenuModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './board-detail.html',
  styleUrl: './board-detail.css',
  providers: [MessageService, ConfirmationService]
})
export class BoardDetail implements OnInit {
  private boardService = inject(BoardService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private confirmationService = inject(AppConfirmationService);
  protected i18n = inject(TranslationService);

  // State
  protected board = signal<BoardWithDetails | null>(null);
  protected columns = signal<ColumnWithTasks[]>([]);
  protected isLoading = signal(false);
  protected hasError = signal(false);
  protected boardId = signal<string>('');

  // Drag & Drop - Computed signal para evitar .map() en template
  protected connectedDropLists = computed<string[]>(() => {
    return this.columns().map(c => 'column-' + c.id);
  });

  // Task dialog state
  protected showTaskDialog = signal(false);
  protected isEditingTask = signal(false);
  protected isSavingTask = signal(false);
  protected selectedColumn = signal<Column | null>(null);
  protected currentTask = signal<Task | null>(null);

  // Task form
  protected taskTitle = signal('');
  protected taskDescription = signal('');
  protected taskPriority = signal<TaskPriority>('Medium');
  protected taskDueDate = signal<Date | null>(null);
  protected taskTags = signal<string[]>([]);

  // Dropdown options
  protected priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' }
  ];

  protected statusOptions = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'OnHold' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.boardId.set(id);
        this.loadBoard(id);
      }
    });
  }

  /**
   * Carga el board con sus columnas y tareas
   */
  private loadBoard(id: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.boardService.getById(id).subscribe({
      next: (board) => {
        this.board.set(board);
        this.organizeColumnsWithTasks(board);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading board:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        this.showError('Error loading board');
      }
    });
  }

  /**
   * Organiza las tareas por columnas
   */
  private organizeColumnsWithTasks(board: BoardWithDetails): void {
    const columnsWithTasks: ColumnWithTasks[] = board.columns
      .sort((a, b) => a.position - b.position)
      .map(column => ({
        ...column,
        tasks: board.tasks
          .filter(task => task.columnId === column.id)
          .sort((a, b) => a.position - b.position)
      }));

    this.columns.set(columnsWithTasks);
  }

  /**
   * Abre el dialog para crear una tarea
   */
  protected openCreateTaskDialog(column: Column): void {
    this.isEditingTask.set(false);
    this.selectedColumn.set(column);
    this.currentTask.set(null);
    this.resetTaskForm();
    this.showTaskDialog.set(true);
  }

  /**
   * Abre el dialog para editar una tarea
   */
  protected openEditTaskDialog(task: Task): void {
    this.isEditingTask.set(true);
    this.currentTask.set(task);
    this.selectedColumn.set(null);
    this.taskTitle.set(task.title);
    this.taskDescription.set(task.description || '');
    this.taskPriority.set(task.priority);
    this.taskDueDate.set(task.dueAt ? new Date(task.dueAt) : null);
    this.taskTags.set([...task.tags]);
    this.showTaskDialog.set(true);
  }

  /**
   * Resetea el formulario de tarea
   */
  private resetTaskForm(): void {
    this.taskTitle.set('');
    this.taskDescription.set('');
    this.taskPriority.set('Medium');
    this.taskDueDate.set(null);
    this.taskTags.set([]);
  }

  /**
   * Cierra el dialog de tarea
   */
  protected closeTaskDialog(): void {
    this.showTaskDialog.set(false);
    this.resetTaskForm();
  }

  /**
   * Maneja el cambio en el campo de tags (string -> string[])
   */
  protected onTagsChange(value: string): void {
    console.log('🏷️ Tags input value:', value);
    
    // Limpiar el valor de posibles caracteres de array JSON
    let cleanValue = value.trim();
    
    // Si el usuario pegó un array JSON, extraer los valores
    if (cleanValue.startsWith('[') && cleanValue.endsWith(']')) {
      try {
        const parsedArray = JSON.parse(cleanValue);
        if (Array.isArray(parsedArray)) {
          this.taskTags.set(parsedArray.filter(t => typeof t === 'string' && t.trim().length > 0));
          console.log('✅ Parsed JSON array:', this.taskTags());
          return;
        }
      } catch (e) {
        // Si falla el parse, continuar con el procesamiento normal
      }
    }
    
    // Procesamiento normal: separar por comas
    const tags = cleanValue
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    console.log('✅ Processed tags:', tags);
    this.taskTags.set(tags);
  }

  /**
   * Guarda la tarea (crear o actualizar)
   */
  protected saveTask(): void {
    const title = this.taskTitle().trim();
    
    if (!title) {
      this.showError('Title is required');
      return;
    }

    this.isSavingTask.set(true);

    if (this.isEditingTask()) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  /**
   * Crea una nueva tarea
   */
  private createTask(): void {
    const column = this.selectedColumn();
    if (!column) {
      console.error('❌ No column selected');
      return;
    }

    const title = this.taskTitle().trim();
    if (!title) {
      this.showError('Title is required');
      return;
    }

    const tags = this.taskTags();
    const request: CreateTaskRequest = {
      columnId: column.id,
      title: title,
      description: this.taskDescription().trim() || undefined,
      priority: this.taskPriority(),
      dueAt: this.taskDueDate() ? this.taskDueDate()!.toISOString() : undefined,
      tags: tags.length > 0 ? tags : undefined
    };

    console.log('📝 Creating task with request:', JSON.stringify(request, null, 2));

    this.taskService.create(this.boardId(), request).subscribe({
      next: (task) => {
        // Recargar el board para obtener las tareas actualizadas
        this.loadBoard(this.boardId());
        this.closeTaskDialog();
        this.isSavingTask.set(false);
        this.showSuccess('Task created successfully');
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.isSavingTask.set(false);
        this.showError(error.message || 'Error creating task');
      }
    });
  }

  /**
   * Actualiza una tarea existente
   */
  private updateTask(): void {
    const task = this.currentTask();
    if (!task) return;

    const tags = this.taskTags();
    const request: UpdateTaskRequest = {
      title: this.taskTitle().trim(),
      description: this.taskDescription().trim() || undefined,
      priority: this.taskPriority(),
      dueAt: this.taskDueDate() ? this.taskDueDate()!.toISOString() : undefined,
      tags: tags.length > 0 ? tags : undefined
    };

    this.taskService.update(this.boardId(), task.id, request).subscribe({
      next: (updatedTask) => {
        // Recargar el board para obtener las tareas actualizadas
        this.loadBoard(this.boardId());
        this.closeTaskDialog();
        this.isSavingTask.set(false);
        this.showSuccess('Task updated successfully');
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.isSavingTask.set(false);
        this.showError(error.message || 'Error updating task');
      }
    });
  }

  /**
   * Elimina una tarea
   */
  protected deleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    
    this.confirmationService.confirmDelete({
      itemName: task.title,
      onConfirm: () => {
        this.taskService.delete(this.boardId(), task.id).subscribe({
          next: () => {
            // Recargar el board
            this.loadBoard(this.boardId());
            this.showSuccess('Task deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.showError(error.message || 'Error deleting task');
          }
        });
      }
    });
  }

  /**
   * Maneja el evento de drop de tareas (drag & drop)
   */
  protected onTaskDrop(event: CdkDragDrop<Task[]>, columnId: string): void {
    const task = event.item.data as Task;
    
    if (event.previousContainer === event.container) {
      // Reordenar dentro de la misma columna
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      
      // Calcular nueva posición
      const newPosition = this.calculateNewPosition(event.container.data, event.currentIndex);
      
      // Actualizar posición en el backend
      if (newPosition !== task.position) {
        this.taskService.move(this.boardId(), task.id, {
          columnId: task.columnId,
          position: newPosition
        }).subscribe({
          next: () => {
            // Actualizar posición localmente
            task.position = newPosition;
          },
          error: (error) => {
            console.error('Error moving task:', error);
            // Revertir cambio visual
            this.loadBoard(this.boardId());
            this.showError(error.message || 'Error moving task');
          }
        });
      }
    } else {
      // Mover entre columnas
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      
      // Calcular nueva posición en la columna destino
      const newPosition = this.calculateNewPosition(event.container.data, event.currentIndex);
      
      // Actualizar en el backend
      this.taskService.move(this.boardId(), task.id, {
        columnId: columnId,
        position: newPosition
      }).subscribe({
        next: (updatedTask) => {
          // Actualizar task local
          task.columnId = columnId;
          task.position = newPosition;
          this.showSuccess('Task moved successfully');
        },
        error: (error) => {
          console.error('Error moving task:', error);
          // Revertir cambio visual
          this.loadBoard(this.boardId());
          this.showError(error.message || 'Error moving task');
        }
      });
    }
  }

  /**
   * Calcula la nueva posición para una tarea basándose en sus vecinos
   */
  private calculateNewPosition(tasks: Task[], index: number): number {
    if (tasks.length === 1) {
      return 10000; // Primera tarea
    }
    
    if (index === 0) {
      // Primera posición
      const nextTask = tasks[1];
      return nextTask.position / 2;
    }
    
    if (index === tasks.length - 1) {
      // Última posición
      const prevTask = tasks[index - 1];
      return prevTask.position + 10000;
    }
    
    // Posición intermedia
    const prevTask = tasks[index - 1];
    const nextTask = tasks[index + 1];
    return (prevTask.position + nextTask.position) / 2;
  }

  /**
   * Vuelve a la lista de boards
   */
  protected goBack(): void {
    this.router.navigate(['/boards']);
  }

  /**
   * Obtiene el color de la prioridad
   */
  protected getPriorityColor(priority: TaskPriority): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const colors: Record<TaskPriority, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      Low: 'info',
      Medium: 'warn',
      High: 'danger',
      Critical: 'danger'
    };
    return colors[priority] || 'info';
  }

  /**
   * Obtiene el color del estado
   */
  protected getStatusColor(status: TaskStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    const colors: Record<TaskStatus, 'success' | 'info' | 'warn' | 'danger' | 'secondary'> = {
      Open: 'info',
      InProgress: 'warn',
      Completed: 'success',
      Cancelled: 'secondary',
      OnHold: 'warn'
    };
    return colors[status] || 'info';
  }

  /**
   * Formatea la fecha
   */
  protected formatDate(date: string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString(this.i18n.language());
  }

  /**
   * Muestra mensaje de éxito
   */
  private showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000
    });
  }

  /**
   * Muestra mensaje de error
   */
  private showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });
  }
}
