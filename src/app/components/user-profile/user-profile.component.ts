import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { environment } from '../../../environments/environment';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [HttpClientModule,CommonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  cars: any[] = [];
  previewImage: string | ArrayBuffer | null = null;
  environment = environment; 

  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      // Load user profile data
      this.user = await this.userService.getProfile();
      console.log("Loaded user:", this.user);

      // Fetch user's cars
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
        console.log("User Cars =>", this.cars);
      }
    } catch (err) {
      console.error("Error loading user profile or cars", err);
    }
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Show preview image before uploading
      const reader = new FileReader();
      reader.onload = () => this.previewImage = reader.result;
      reader.readAsDataURL(file);

      try {
        // Upload image to backend
        const res = await this.userService.uploadProfilePicture(file);

        // Save returned image path or URL
        this.user.image = res.image;
      } catch (err) {
        console.error("Error uploading profile picture", err);
      }
    }
  }

  trackByCar(index: number, car: any) {
    return car._id;
  }

  // Normalize path slashes
fixImagePath(path: any): string {
  if (!path) return '';
  
  if (typeof path !== 'string') {
    console.warn("⚠️ fixImagePath received non-string:", path);
    return '';
  }

  return path.replace(/\\/g, "/");
}

  // Get car image or fallback
getCarImage(car: any): string {
  if (car.images && car.images.originals && car.images.originals.length > 0) {
    return `${environment.apiUrl}${car.images.originals[0]}`;
  }

  if (car.images && Array.isArray(car.images) && car.images.length > 0) {
    return `${environment.apiUrl}${car.images[0]}`;
  }

  return 'assets/no-image.png';
}
  // Get profile image or fallback
  getProfileImage(): string {
    // If a new image was selected → show preview
    if (this.previewImage) {
      return this.previewImage as string;
    }

    if (this.user?.image) {
      const fixedPath = this.fixImagePath(this.user.image);

      // Case 1: Backend already returns full URL
      if (fixedPath.startsWith('http')) {
        return fixedPath;
      }

      // Case 2: Backend returns path starting with /uploads
      if (fixedPath.startsWith('/uploads')) {
        return `${environment.apiUrl}${fixedPath}`;
      }

      // Case 3: Backend returns only filename
      return `${environment.apiUrl}/uploads/avatars/${fixedPath}`;
    }

    // Default placeholder
    return 'assets/no-user.png';
  }

  openCar(id: string) {
    this.router.navigate(['/cars', id]);
  }
}
