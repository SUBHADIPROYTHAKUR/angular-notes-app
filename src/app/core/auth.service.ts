import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebaseAuth from 'firebase/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState: any = null;
  userData: any;

  authState$: Observable<any>;


  constructor(public afAuth: AngularFireAuth, private route: Router, private ngZone: NgZone) {
    this.authState$ = this.afAuth.authState; // Observable for auth state changes
    this.afAuth.authState.subscribe((user) => {
      this.authState = user;
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  get isLoggedIn(): boolean {
    return !!JSON.parse(localStorage.getItem('user'));
  }

  get currentUserId(): string {
    return this.authenticated ? this.authState.uid : null;
  }

  public navigateToSignIn(): void {
    this.route.navigate(['/sign-in']);
  }
  getCurrentUserEmail(): string {
    const email = this.authState?.email || JSON.parse(localStorage.getItem('user'))?.email || '';
    console.log('Current User Email:', email.trim().toLowerCase()); // Log normalized email
    return email.trim().toLowerCase(); // Normalize email
  }

  // ✅ Google Login
  loginGoogle() {
    this.afAuth
      .signInWithPopup(new firebaseAuth.GoogleAuthProvider())
      .then(() => this.route.navigate(['/notes']))
      .catch((err) => console.error('Google Login Error:', err));
  }

  // ✅ Email Login
  loginWithEmail(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => this.route.navigate(['/notes']))
      .catch((err) => alert('Login Failed: ' + err.message));
  }

  // ✅ Email Signup
  registerWithEmail(email: string, password: string) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        // ✅ Update user profile with a display name
        return result.user?.updateProfile({
          displayName: email.split('@')[0] // or prompt user for a name
        }).then(() => {
          this.route.navigate(['/notes']);
        });
      })
      .catch((err) => alert('Registration Failed: ' + err.message));
  }


  // ✅ Logout
  logout() {
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.route.navigate(['/sign-in']);
    });
  }

  sendPasswordResetEmail(email: string) {
    return this.afAuth.sendPasswordResetEmail(email)
      .then(() => {
        alert('A reset link has been sent to your email.');
      })
      .catch((error) => {
        alert('Erreur : ' + error.message);
      });
  }


}
