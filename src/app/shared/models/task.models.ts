/**
 * Modelos de Tasks - Planify
 * Basados en Postman Collection: ✅ Tasks
 */

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type TaskStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled' | 'OnHold';

export interface Task {
  id: string;
  boardId: string;
  columnId: string;
  title: string;
  description: string | null;
  dueAt: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  assignedUserId: string | null;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateTaskRequest {
  columnId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueAt?: string;
  assignedUserId?: string;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueAt?: string;
  assignedUserId?: string;
  tags?: string[];
}

export interface MoveTaskRequest {
  columnId: string;
  position: number;
}

export interface TaskQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
  assignedUserId?: string;
  status?: TaskStatus;
  from?: string;
  to?: string;
}

export interface PaginatedTaskResponse {
  items: Task[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
