import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  // Login request
  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.token) this.saveToken(res.token);
      })
    );
  }

  // Register request
  register(data: { name: string; email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.token) this.saveToken(res.token);
      })
    );
  }

  // Save token
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log("Saved token:", token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Decode user info
  getUser(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}
