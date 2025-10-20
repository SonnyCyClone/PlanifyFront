/**
 * Modelos de Boards y Columns - Planify
 * Basados en Postman Collection: 📋 Boards y 📂 Columns
 */

import type { Task } from './task.models';

export interface Board {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface BoardWithDetails extends Board {
  columns: Column[];
  tasks: Task[];
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
  createdAt: string;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
}

export interface UpdateBoardRequest {
  name: string;
  description?: string;
}

export interface CreateColumnRequest {
  name: string;
  position?: number;
}

export interface UpdateColumnRequest {
  name: string;
}

export interface ReorderColumnRequest {
  newPosition: number;
}
