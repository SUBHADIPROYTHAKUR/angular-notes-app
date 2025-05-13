import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Note } from './note';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  notesCollection: AngularFirestoreCollection<Note>;
  notesDocument: AngularFirestoreDocument<Note>;
  userData = '';

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$: Observable<string> = this.searchQuerySubject.asObservable();

  private priorityFilterSubject = new BehaviorSubject<string>('All');
  priorityFilter$: Observable<string> = this.priorityFilterSubject.asObservable();

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userData = user.uid;
        this.notesCollection = this.afs.collection('notes', (ref) =>
          ref
            .where('authorId', '==', this.userData)
            .orderBy('date', 'desc')
        );
      }
    });
  }

  getAllNotes(userEmail: string): Observable<Note[]> {
    return this.afs
      .collection('notes', (ref) =>
        ref.where('authorId', '==', this.userData).orderBy('date', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Note;
            const id = a.payload.doc.id;
            return { id, ...data, date: (data.date instanceof firebase.default.firestore.Timestamp ? data.date.toDate() : data.date) };
          })
        )
      );
  }

  getNotesForUser(userEmail: string): Observable<Note[]> {
    return this.afs
      .collection('notes', (ref) =>
        ref.where('collaborators', 'array-contains', userEmail)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Note;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getSharedNotes(userEmail: string): Observable<Note[]> {
    const normalizedEmail = userEmail.trim().toLowerCase();
    return this.afs
      .collection('notes', (ref) =>
        ref.where('collaborators', 'array-contains', normalizedEmail)
      )
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Note;
            const id = a.payload.doc.id;
            return { id, ...data, date: (data.date instanceof firebase.default.firestore.Timestamp ? data.date.toDate() : data.date) };
          })
        )
      );
  }

  addCollaborator(noteId: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('Adding collaborator:', { noteId, normalizedEmail });
    return this.afs.doc(`notes/${noteId}`).update({
      collaborators: firebase.default.firestore.FieldValue.arrayUnion(normalizedEmail),
    });
  }

  getNoteData(id: string) {
    this.notesDocument = this.afs.doc<Note>(`notes/${id}`);
    return this.notesDocument.valueChanges();
  }

  createNote(data: Note): Promise<void> {
    return this.notesCollection.add(data).then(() => {
      console.log('Note created successfully!');
    });
  }

  getNote(id: string) {
    return this.afs.doc<Note>(`notes/${id}`);
  }

  updateNote(id: string, formData: Partial<Note>) {
    this.getNote(id).update(formData);
  }

  deleteNote(id: string) {
    this.getNote(id).delete();
  }

  updateSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  updatePriorityFilter(priority: string | null) {
 this.priorityFilterSubject.next(priority);
  }
}
