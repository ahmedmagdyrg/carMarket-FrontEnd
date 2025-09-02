import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  dateOfBirth = '';
  avatar: File | null = null;
  avatarPreview: string | null = null;
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.avatar = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(this.avatar);
    }
  }

  removeAvatar() {
    this.avatar = null;
    this.avatarPreview = null;
  }

  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.dateOfBirth) {
      this.error = 'Please fill all required fields.';
      return;
    }

    this.error = '';
    this.loading = true;

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('dateOfBirth', this.dateOfBirth);
    if (this.avatar) {
      formData.append('avatar', this.avatar);
    }

    this.auth.register(formData).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Your account has been created successfully. Please login.',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.error = 'This email is already registered.';
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Registration failed. Please try again.';
        }
      }
    });
  }
}
