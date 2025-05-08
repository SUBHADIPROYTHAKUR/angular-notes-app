import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;

  constructor(private auth: AuthService, private fb: FormBuilder) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendResetLink() {
    const email = this.resetForm.value.email;
    this.auth.sendPasswordResetEmail(email);
  }
}
