import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.auth.saveToken(res.token);
        this.router.navigate(['/cars']);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 403 && err.error?.message) {
          Swal.fire({
            icon: 'error',
            title: 'Account Suspended',
            text: err.error.message,
            confirmButtonText: 'OK'
          }).then(() => {
            this.auth.logout();
            this.router.navigate(['/login']);
          });
        } else {
          this.error = err.error?.message || 'Login failed. Please check your credentials.';
        }
      }
    });
  }
}
