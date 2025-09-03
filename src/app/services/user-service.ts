import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  async getProfile(): Promise<any> {
    return await firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/me`, this.getAuthHeaders())
    );
  }

  async updateProfile(data: any): Promise<any> {
    const options = this.getAuthHeaders();
    if (!(data instanceof FormData)) {
      options.headers = options.headers.set('Content-Type', 'application/json');
    }
    return await firstValueFrom(
      this.http.patch<any>(`${this.apiUrl}/me`, data, options)
    );
  }

  async uploadProfilePicture(file: File): Promise<{ image: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return await firstValueFrom(
      this.http.post<{ image: string }>(
        `${this.apiUrl}/me/avatar`,
        formData,
        this.getAuthHeaders()
      )
    );
  }

  async getMyCars(): Promise<any[]> {
    return await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/me/cars`, this.getAuthHeaders())
    ).then(res => res || []);
  }

  async getAllUsers(): Promise<any[]> {
    return await firstValueFrom(
      this.http.get<any[]>(`${this.apiUrl}/users`, this.getAuthHeaders())
    );
  }

  async banUser(userId: string): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.apiUrl}/users/${userId}/ban`, {}, this.getAuthHeaders())
    );
  }

  async unbanUser(userId: string): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${this.apiUrl}/users/${userId}/unban`, {}, this.getAuthHeaders())
    );
  }

  async deleteUser(userId: string): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${this.apiUrl}/users/${userId}`, this.getAuthHeaders())
    );
  }

  async getDashboardStats(): Promise<any> {
    return await firstValueFrom(
      this.http.get<any>(`${this.apiUrl}/admin/dashboard-stats`, this.getAuthHeaders())
    );
  }
getUserById(id: string): Promise<any> {
  return this.http.get<any>(`${this.apiUrl}/users/${id}`, this.getAuthHeaders()).toPromise();
}

}
