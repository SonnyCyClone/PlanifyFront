import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ChipModule } from 'primeng/chip';

// Services & Models
import { NoteService } from '../../../shared/services/note.service';
import { TranslationService } from '../../../shared/services/i18n/translation.service';
import { AppConfirmationService } from '../../../shared/services/confirmation.service';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../../../shared/models/note.models';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToastModule,
    SkeletonModule,
    TooltipModule,
    ChipModule,
    ConfirmDialogModule
  ],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css',
  providers: [MessageService, ConfirmationService]
})
export class NoteList implements OnInit {
  private noteService = inject(NoteService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(AppConfirmationService);
  protected i18n = inject(TranslationService);

  // State
  protected notes = signal<Note[]>([]);
  protected isLoading = signal(false);
  protected hasError = signal(false);

  // Dialog state
  protected showNoteDialog = false;
  protected isEditingNote = signal(false);
  protected isSavingNote = signal(false);
  protected currentNote = signal<Note | null>(null);

  // Form (NO signals para ngModel)
  protected noteTitle = '';
  protected noteContent = '';

  ngOnInit(): void {
    this.loadNotes();
  }

  /**
   * Carga todas las notas del usuario
   */
  protected loadNotes(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.noteService.getAll().subscribe({
      next: (notes) => {
        this.notes.set(notes);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to load notes'
        });
      }
    });
  }

  /**
   * Abre el diálogo para crear una nueva nota
   */
  protected openCreateNoteDialog(): void {
    this.isEditingNote.set(false);
    this.currentNote.set(null);
    this.noteTitle = '';
    this.noteContent = '';
    this.showNoteDialog = true;
  }

  /**
   * Abre el diálogo para editar una nota existente
   */
  protected openEditNoteDialog(note: Note): void {
    this.isEditingNote.set(true);
    this.currentNote.set(note);
    this.noteTitle = note.title;
    this.noteContent = note.content;
    this.showNoteDialog = true;
  }

  /**
   * Cierra el diálogo de nota
   */
  protected closeNoteDialog(): void {
    this.showNoteDialog = false;
    this.currentNote.set(null);
    this.noteTitle = '';
    this.noteContent = '';
  }

  /**
   * Guarda la nota (crear o actualizar)
   */
  protected saveNote(): void {
    const title = this.noteTitle.trim();
    const content = this.noteContent.trim();

    if (!title || !content) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Title and content are required'
      });
      return;
    }

    this.isSavingNote.set(true);

    if (this.isEditingNote()) {
      this.updateNote();
    } else {
      this.createNote();
    }
  }

  /**
   * Crea una nueva nota
   */
  private createNote(): void {
    const request: CreateNoteRequest = {
      title: this.noteTitle,
      content: this.noteContent
    };

    this.noteService.create(request).subscribe({
      next: (note) => {
        this.notes.update(notes => [note, ...notes]);
        this.closeNoteDialog();
        this.isSavingNote.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Note created successfully'
        });
      },
      error: (error) => {
        console.error('Error creating note:', error);
        this.isSavingNote.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to create note'
        });
      }
    });
  }

  /**
   * Actualiza una nota existente
   */
  private updateNote(): void {
    const currentNote = this.currentNote();
    if (!currentNote) return;

    const request: UpdateNoteRequest = {
      title: this.noteTitle,
      content: this.noteContent
    };

    this.noteService.update(currentNote.id, request).subscribe({
      next: (updatedNote) => {
        this.notes.update(notes =>
          notes.map(n => n.id === updatedNote.id ? updatedNote : n)
        );
        this.closeNoteDialog();
        this.isSavingNote.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Note updated successfully'
        });
      },
      error: (error) => {
        console.error('Error updating note:', error);
        this.isSavingNote.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to update note'
        });
      }
    });
  }

  /**
   * Elimina una nota
   */
  protected deleteNote(note: Note, event: Event): void {
    event.stopPropagation();

    this.confirmationService.confirmDelete({
      itemName: note.title,
      onConfirm: () => {
        this.noteService.delete(note.id).subscribe({
          next: () => {
            this.notes.update(notes => notes.filter(n => n.id !== note.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Note deleted successfully'
            });
          },
          error: (error) => {
            console.error('Error deleting note:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete note'
            });
          }
        });
      }
    });
  }

  /**
   * Navega al detalle de una nota
   */
  protected viewNoteDetail(note: Note): void {
    this.router.navigate(['/notes', note.id]);
  }

  /**
   * Formatea la fecha de una nota
   */
  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Obtiene un extracto del contenido
   */
  protected getContentExcerpt(content: string): string {
    const plainText = content.replace(/[#*`\n]/g, ' ').trim();
    return plainText.length > 120 
      ? plainText.substring(0, 120) + '...' 
      : plainText;
  }
}
