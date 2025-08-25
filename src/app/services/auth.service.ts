import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'token';

  // BehaviorSubject to track login state
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Login request
  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  // Register request
  register(data: { name: string; email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
          this.isLoggedInSubject.next(true);
        }
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
    this.isLoggedInSubject.next(false);
  }

  // Check if logged in
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Decode user info (JWT payload)
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

  // Convenience: get current user id from token
  getUserId(): string | null {
    const u = this.getUser();
    return u?.id ?? null;
  }

  //  Added: currentUser getter for easier access
  get currentUser(): any {
    return this.getUser();
  }

  // Helper: check token exists
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }



  // Auto login restore
  autoLogin(): void {
    const token = this.getToken();
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }
}