import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5000/api/auth';
  private readonly TOKEN_KEY = 'token';

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  register(data: FormData): Observable<{ token?: string }> {
    return this.http.post<{ token?: string }>(`${this.apiUrl}/register`, data).pipe(
      tap(res => {
        if (res.token) {
          this.saveToken(res.token);
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUser(): any {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  getUserId(): string | null {
    return this.getUser()?.id ?? null;
  }

  getUserRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  get currentUser(): any {
    return this.getUser();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  autoLogin(): void {
    const token = this.getToken();
    if (token) {
      const payload = this.decodeToken(token);
      if (payload && (!payload.exp || Date.now() < payload.exp * 1000)) {
        this.isLoggedInSubject.next(true);
      } else {
        this.logout();
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}
