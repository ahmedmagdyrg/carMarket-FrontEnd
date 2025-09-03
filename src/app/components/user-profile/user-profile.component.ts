import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HttpClientModule, CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  cars: any[] = [];
  previewImage: string | ArrayBuffer | null = null;
  environment = environment; 
  userIdFromRoute: string | null = null;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.userIdFromRoute = this.route.snapshot.paramMap.get('id');

      if (this.userIdFromRoute) {
        this.user = await this.userService.getUserById(this.userIdFromRoute);
      } else {
        this.user = await this.userService.getProfile();
      }

      if (this.user && this.user._id) {
        const res = await fetch(`${environment.apiUrl}/api/cars/user/${this.user._id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch cars, status: ${res.status}`);
        }

        this.cars = await res.json();
      }
    } catch (err) {
      console.error("Error loading user profile or cars", err);
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);

      try {
        const res = await this.userService.uploadProfilePicture(file);
        this.user.image = res.image;
      } catch (err) {
        console.error("Error uploading profile picture", err);
      }
    }
  }

  trackByCar(index: number, car: any) {
    return car._id;
  }

  fixImagePath(path: any): string {
    if (!path) return '';
    if (typeof path !== 'string') return '';
    return path.replace(/\\/g, "/");
  }

  getCarImage(car: any): string {
    if (car.images && car.images.originals && car.images.originals.length > 0) {
      return `${environment.apiUrl}${car.images.originals[0]}`;
    }
    if (car.images && Array.isArray(car.images) && car.images.length > 0) {
      return `${environment.apiUrl}${car.images[0]}`;
    }
    return 'assets/no-image.png';
  }

  getProfileImage(): string {
    if (this.previewImage) {
      return this.previewImage as string;
    }
    if (this.user?.image) {
      const fixedPath = this.fixImagePath(this.user.image);
      if (fixedPath.startsWith('http')) {
        return fixedPath;
      }
      if (fixedPath.startsWith('/uploads')) {
        return `${environment.apiUrl}${fixedPath}`;
      }
      return `${environment.apiUrl}/uploads/avatars/${fixedPath}`;
    }
    return 'assets/no-user.png';
  }

  openCar(id: string) {
    this.router.navigate(['/cars', id]);
  }
}
