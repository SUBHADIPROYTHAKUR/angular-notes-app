import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userAvatar: string = '';
  userName: string = '';

  constructor(public auth: AuthService, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // ✅ Fallbacks
        this.userName = user.displayName || user.email || 'User';
        this.userAvatar = user.photoURL || 'https://grandimageinc.com/wp-content/uploads/2015/09/icon-user-default.png';
      }
    });
  }

  errorHandler(event: any) {
    event.target.src = 'https://grandimageinc.com/wp-content/uploads/2015/09/icon-user-default.png';
  }
}
