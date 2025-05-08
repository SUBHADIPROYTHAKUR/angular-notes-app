import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { NoteService } from '../note.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.css'],
})
export class CreateNoteComponent implements OnInit {
  title: string;
  description: string;
  priority: string = 'Medium'; // Default priority

  constructor(
    private auth: AuthService,
    private notesService: NoteService,
    private router: Router, // Inject Router
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  noteCreation() {
    const data = {
      authorId: this.auth.currentUserId,
      authorName: this.auth.authState?.displayName || this.auth.getCurrentUserEmail(), // Use display name or email
      title: this.title,
      description: this.description,
      date: new Date(),
      collaborators: [],
      priority: this.priority, // Include priority
    };

    this.notesService.createNote(data).then(() => {
      this.clearFields();
      this.toastr.success('Note added successfully!');
      this.router.navigate(['/notes']); // Redirect to home page
    }).catch((err) => {
      this.toastr.error('Failed to add note: ' + err.message);
    });
  }

  clearFields() {
    this.title = '';
    this.description = '';
    this.priority = 'Medium'; // Reset priority
  }
}
