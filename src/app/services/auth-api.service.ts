import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  username: string;
  role: string;
  isApproved: boolean;
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private apiUrl = 'https://localhost:7173/api/auth';
  private storageKey = 'warehouse_user';

  constructor(private http: HttpClient) {}

  register(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request);
  }

  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request);
  }

  saveUser(user: AuthResponse): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    }
  }

  getUser(): AuthResponse | null {
    if (!this.isBrowser()) {
      return null;
    }

    try {
      const savedUser = localStorage.getItem(this.storageKey);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  }

  getToken(): string | null {
    const user = this.getUser();
    return user?.token || null;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.storageKey);
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}