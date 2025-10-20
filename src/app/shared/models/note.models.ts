/**
 * Modelos de Notes - Planify
 * Basados en Postman Collection: 📝 Notes
 */

export interface Note {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateNoteRequest {
  title: string;
  content: string;
  tags?: string[];
}

export interface ConvertNoteToTaskRequest {
  boardId: string;
  columnId: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  dueAt?: string;
}

export interface ConvertNoteToTaskResponse {
  taskId: string;
}
