import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  WarehouseApiService,
  AppUser
} from '../../services/warehouse-api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css'
})
export class AdminUsers implements OnInit {

  users: AppUser[] = [];

  constructor(private api: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Laden der Benutzer.');
      }
    });
  }

  approveUser(user: AppUser): void {
    this.api.approveUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Freigeben.');
      }
    });
  }

  rejectUser(user: AppUser): void {
    const confirmed = confirm(
      `Möchten Sie den Benutzer "${user.username}" löschen?`
    );

    if (!confirmed) {
      return;
    }

    this.api.rejectUser(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Löschen.');
      }
    });
  }

  makeAdmin(user: AppUser): void {
    this.api.makeAdmin(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        console.error(err);
        alert('Fehler beim Ändern der Rolle.');
      }
    });
  }
}