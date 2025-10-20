import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

// Services & Models
import { BoardService } from '../../../shared/services/board.service';
import { TranslationService } from '../../../shared/services/i18n/translation.service';
import type { Board, CreateBoardRequest, UpdateBoardRequest } from '../../../shared/models';

@Component({
  selector: 'app-board-list',
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialogModule,
    ToastModule,
    SkeletonModule,
    TooltipModule
  ],
  templateUrl: './board-list.html',
  styleUrl: './board-list.css',
  providers: [ConfirmationService, MessageService]
})
export class BoardList implements OnInit {
  private boardService = inject(BoardService);
  private router = inject(Router);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  protected i18n = inject(TranslationService);

  // State signals
  protected boards = signal<Board[]>([]);
  protected isLoading = signal(false);
  protected hasError = signal(false);

  // Dialog state
  protected showDialog = false;
  protected isEditMode = signal(false);
  protected isSaving = signal(false);
  protected currentBoard = signal<Board | null>(null);

  // Form data (NO signals para ngModel)
  protected boardName = '';
  protected boardDescription = '';

  ngOnInit(): void {
    this.loadBoards();
  }

  /**
   * Carga todos los boards del usuario
   */
  protected loadBoards(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.boardService.getAll().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading boards:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        this.showError(this.i18n.t.boards.error);
      }
    });
  }

  /**
   * Abre el dialog para crear un nuevo board
   */
  protected openCreateDialog(): void {
    this.isEditMode.set(false);
    this.currentBoard.set(null);
    this.boardName = '';
    this.boardDescription = '';
    this.showDialog = true;
  }

  /**
   * Abre el dialog para editar un board
   */
  protected openEditDialog(board: Board): void {
    this.isEditMode.set(true);
    this.currentBoard.set(board);
    this.boardName = board.name;
    this.boardDescription = board.description || '';
    this.showDialog = true;
  }

  /**
   * Cierra el dialog
   */
  protected closeDialog(): void {
    this.showDialog = false;
    this.boardName = '';
    this.boardDescription = '';
    this.currentBoard.set(null);
  }

  /**
   * Guarda el board (crear o actualizar)
   */
  protected saveBoard(): void {
    const name = this.boardName.trim();
    
    if (!name) {
      this.showError(this.i18n.t.boards.dialog.nameRequired);
      return;
    }

    this.isSaving.set(true);

    if (this.isEditMode()) {
      this.updateBoard();
    } else {
      this.createBoard();
    }
  }

  /**
   * Crea un nuevo board
   */
  private createBoard(): void {
    const request: CreateBoardRequest = {
      name: this.boardName.trim(),
      description: this.boardDescription.trim() || undefined
    };

    this.boardService.create(request).subscribe({
      next: (board) => {
        this.boards.update(boards => [board, ...boards]);
        this.closeDialog();
        this.isSaving.set(false);
        this.showSuccess(this.i18n.t.boards.dialog.createTitle);
      },
      error: (error) => {
        console.error('Error creating board:', error);
        this.isSaving.set(false);
        this.showError(error.message);
      }
    });
  }

  /**
   * Actualiza un board existente
   */
  private updateBoard(): void {
    const board = this.currentBoard();
    if (!board) return;

    const request: UpdateBoardRequest = {
      name: this.boardName.trim(),
      description: this.boardDescription.trim() || undefined
    };

    this.boardService.update(board.id, request).subscribe({
      next: (updatedBoard) => {
        this.boards.update(boards => 
          boards.map(b => b.id === updatedBoard.id ? updatedBoard : b)
        );
        this.closeDialog();
        this.isSaving.set(false);
        this.showSuccess(this.i18n.t.boards.dialog.editTitle);
      },
      error: (error) => {
        console.error('Error updating board:', error);
        this.isSaving.set(false);
        this.showError(error.message);
      }
    });
  }

  /**
   * Confirma y elimina un board
   */
  protected confirmDelete(board: Board, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: this.i18n.t.boards.confirmDelete,
      header: this.i18n.t.boards.delete,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.i18n.t.boards.delete,
      rejectLabel: this.i18n.t.boards.dialog.cancel,
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteBoard(board.id);
      }
    });
  }

  /**
   * Elimina un board
   */
  private deleteBoard(id: string): void {
    this.boardService.delete(id).subscribe({
      next: () => {
        this.boards.update(boards => boards.filter(b => b.id !== id));
        this.showSuccess(this.i18n.t.boards.deleted);
      },
      error: (error) => {
        console.error('Error deleting board:', error);
        this.showError(error.message);
      }
    });
  }

  /**
   * Navega al detalle del board
   */
  protected openBoard(board: Board): void {
    this.router.navigate(['/boards', board.id]);
  }

  /**
   * Formatea fecha para mostrar
   */
  protected formatDate(date: string | null): string {
    if (!date) return '-';
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
