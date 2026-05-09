import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import {
  AuthApiService,
  AuthRequest
} from '../../services/auth-api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  username = '';
  password = '';
  isLoading = false;

  constructor(
    private authApi: AuthApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      this.toastr.warning('Bitte Benutzername und Passwort eingeben.', 'Warnung');
      return;
    }

    this.isLoading = true;

    const request: AuthRequest = {
      username: this.username.trim(),
      password: this.password
    };

    this.authApi.login(request).subscribe({
      next: (user) => {
        this.isLoading = false;

        this.authApi.saveUser(user);
        this.toastr.success('Login erfolgreich.', 'Erfolg');
        this.router.navigate(['/']);
      },

      error: (err) => {
        this.isLoading = false;

        const backendMessage = err.error?.message;

        if (backendMessage === 'Account not approved yet.') {
          this.toastr.warning(
            'Dein Konto wurde noch nicht vom Admin freigegeben.',
            'Konto wartet auf Freigabe'
          );
          return;
        }

        this.toastr.error(
          'Benutzername oder Passwort ist falsch.',
          'Login fehlgeschlagen'
        );
      }
    });
  }
}