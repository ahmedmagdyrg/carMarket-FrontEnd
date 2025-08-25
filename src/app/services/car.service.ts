import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CarService {
  private readonly dataUrl = 'http://localhost:5000/api/cars';

  cars = signal<any[] | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  private mapCar(c: any) {
    return { ...c, id: c._id };
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  async load(): Promise<void> {
    if (this.cars()) return;
    const data = await firstValueFrom(
      this.http.get<any[]>(this.dataUrl, this.getAuthHeaders())
    );
    this.cars.set(data.map(c => this.mapCar(c)));
  }

  async getAll(): Promise<any[]> {
    const data = await firstValueFrom(
      this.http.get<any[]>(this.dataUrl, this.getAuthHeaders())
    );
    const mapped = data.map(c => this.mapCar(c));
    this.cars.set(mapped);
    return mapped;
  }

  async getById(id: string): Promise<any | undefined> {
    const car = await firstValueFrom(
      this.http.get<any>(`${this.dataUrl}/${id}`, this.getAuthHeaders())
    );
    return this.mapCar(car);
  }

  async create(car: any): Promise<any> {
    const created = await firstValueFrom(
      this.http.post<any>(this.dataUrl, car, this.getAuthHeaders())
    );
    const mapped = this.mapCar(created);
    this.cars.set([...(this.cars() ?? []), mapped]);
    return mapped;
  }

  async update(id: string, patch: any): Promise<any | undefined> {
    const updated = await firstValueFrom(
      this.http.put<any>(`${this.dataUrl}/${id}`, patch, this.getAuthHeaders())
    );
    const mapped = this.mapCar(updated);
    this.cars.set((this.cars() ?? []).map(c => (c.id === id ? mapped : c)));
    return mapped;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${this.dataUrl}/${id}`, this.getAuthHeaders())
    );
    this.cars.set((this.cars() ?? []).filter(c => c.id !== id));
  }
}
