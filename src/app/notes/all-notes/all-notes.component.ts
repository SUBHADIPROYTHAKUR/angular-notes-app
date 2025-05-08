import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Note } from '../note';
import { NoteService } from '../note.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.css'],
})
export class AllNotesComponent implements OnInit {
  notes: Observable<Note[]>; // Changed to Observable<Note[]>
  GotNoteForUpdate: Note = {} as Note;
  IdOfNoteToBeUpdated: string;

  collaboratorEmail: string = '';
  selectedNoteId: string;
  currentUserId: string; // Store the logged-in user's ID

  constructor(private notesService: NoteService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.authState$.subscribe((user) => {
      if (user) {
        this.currentUserId = this.authService.currentUserId; // Get the logged-in user's ID
        const userEmail = this.authService.getCurrentUserEmail();
        console.log('Logged-in user email:', userEmail);

        const authoredNotes$ = this.notesService.getAllNotes(userEmail);
        const sharedNotes$ = this.notesService.getSharedNotes(userEmail);

        this.notes = combineLatest([authoredNotes$, sharedNotes$]).pipe(
          map(([authoredNotes, sharedNotes]) => {
            console.log('Authored Notes:', authoredNotes);
            console.log('Shared Notes:', sharedNotes);
            return [...authoredNotes, ...sharedNotes];
          })
        );
      } else {
        console.log('User is not logged in. Redirecting to login page.');
        this.authService.logout(); // Ensure the user is logged out
        this.authService.navigateToSignIn(); // Redirect to login
      }
    });
  }

  noteDeleting(id: string) {
    this.notesService.deleteNote(id);
  }

  getNoteToBeEdited(id: string) {
    this.notesService.getNoteData(id).subscribe((data) => (this.GotNoteForUpdate = data));
    this.IdOfNoteToBeUpdated = id;
  }

  noteUpdating() {
    const formData = {
      title: this.GotNoteForUpdate.title,
      description: this.GotNoteForUpdate.description,
      priority: this.GotNoteForUpdate.priority,
    };
    this.notesService.updateNote(this.IdOfNoteToBeUpdated, formData);
    this.IdOfNoteToBeUpdated = '';
    console.log('note edited');
  }

  openShareModal(noteId: string) {
    this.selectedNoteId = noteId;
    this.collaboratorEmail = '';
  }

  addCollaborator() {
    if (!this.collaboratorEmail || !this.selectedNoteId) return;

    this.notesService
      .addCollaborator(this.selectedNoteId, this.collaboratorEmail)
      .then(() => {
        alert('Collaborator added successfully!');
        this.collaboratorEmail = '';
      })
      .catch((err) => {
        alert('Error adding collaborator: ' + err.message);
      });
  }

  updatePriority(noteId: string, priority: string) {
    this.notesService.updateNote(noteId, { priority });
    console.log(`Priority updated for note ${noteId} to ${priority}`);
  }
}



