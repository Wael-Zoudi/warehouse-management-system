import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../services/auth-api.service';

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

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  login(): void {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Bitte Benutzername und Passwort eingeben.');
      return;
    }

    this.authApi.login({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: (user) => {
        if (!user.isApproved) {
          alert('Dein Konto wurde noch nicht freigegeben.');
          return;
        }

        if (!user.token || user.token.trim() === '') {
          alert('Fehler: Kein Token erhalten.');
          return;
        }

        this.authApi.saveUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('LOGIN ERROR:', err);

        if (err.error?.message === 'Account not approved yet.') {
          alert('Dein Konto wurde noch nicht freigegeben.');
        } else {
          alert('Benutzername oder Passwort ist falsch.');
        }
      }
    });
  }
}