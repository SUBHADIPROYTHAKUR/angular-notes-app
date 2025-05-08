import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  signInForm!: FormGroup;
  signUpForm!: FormGroup;
  isSignUp = false; // toggle form

  constructor(
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate(['/notes']);
      }
    });
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
  }

  loginWithEmail() {
    const { email, password } = this.signInForm.value;
    this.auth.loginWithEmail(email, password);
  }

  registerWithEmail() {
    const { email, password } = this.signUpForm.value;
    this.auth.registerWithEmail(email, password);
  }
}
