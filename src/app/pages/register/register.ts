import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(
    private authApi: AuthApiService,
    private router: Router
  ) {}

  register(): void {
    if (!this.username.trim() || !this.password.trim() || !this.confirmPassword.trim()) {
      alert('Bitte alle Felder ausfüllen.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwörter stimmen nicht überein.');
      return;
    }

    this.authApi.register({
      username: this.username.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        alert('Konto wurde erstellt. Bitte einloggen.');
        this.router.navigate(['/login']);
      },
      error: () => {
        alert('Registrierung fehlgeschlagen. Benutzername existiert vielleicht bereits.');
      }
    });
  }
}