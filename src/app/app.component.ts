import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
<header class="topbar">
  <div class="brand" routerLink="/cars">
    <img src="assets/icon2.png" alt="logo" class="logo">
    <span>CarSpot</span>
  </div>

  <nav class="actions">
    <!-- If user is logged in -->
    <ng-container *ngIf="isLoggedIn; else guestLinks">
      <!-- Show Add Listing button only when user is logged in -->
      <a class="btn btn-accent-outline" routerLink="/cars/new">
        Add Listing
      </a>

      <!-- Logout button -->
      <button (click)="logout()" class="btn btn-danger-outline">Logout</button>
    </ng-container>

    <!-- If user is NOT logged in -->
    <ng-template #guestLinks>
      <!-- Login and Register buttons -->
      <a routerLink="/login" class="btn btn-primary-outline">Login</a>
      <a routerLink="/register" class="btn btn-primary-outline">Register</a>
    </ng-template>
  </nav>
</header>

<main class="container">
  <!-- This will load the current route content -->
  <router-outlet></router-outlet>
</main>
    <footer class="footer">
      <span>© {{year}} CarSpot</span>
    </footer>
  `,
  styles: [`
    :host { 
      --bg:#FFFFFF; --primary:#1DA1F2; --accent:#FF8C42;
      --text:#333333; --muted:#666666; --border:#E0E0E0; 
      --danger:#e63946; 
    }
    .topbar{
      position: sticky; top:0; z-index:10;
      display:flex; justify-content:space-between; align-items:center;
      padding:14px 20px; background:#fff; border-bottom:1px solid var(--border);
    }
    .brand{ 
      font-weight:800; 
      color:var(--primary); 
      cursor:pointer; 
      font-size:22px; 
      display:flex; 
      align-items:center; 
    }
    .logo { 
      height: 22px; 
      margin-right: 10px; 
    }
    .actions{ 
      display:flex; 
      gap:10px; 
      align-items:center; 
    }
    .link{ 
      color:var(--text); 
      text-decoration:none; 
      padding:6px 10px; 
      border-radius:6px; 
    }
    .link:hover{ 
      background:#f7f7f7; 
    }
    .btn{ 
      border:none; 
      cursor:pointer; 
      padding:10px 14px; 
      border-radius:8px; 
      font-weight:600; 
      text-decoration:none; 
      display:inline-block; 
    }

    .btn-danger-outline{
      border:2px solid var(--danger);
      background:transparent;
      color:var(--danger);
    }
    .btn-danger-outline:hover{
      background:var(--danger);
      color:#fff;
    }

    .btn-primary-outline{
      border:2px solid var(--primary);
      background:transparent;
      color:var(--primary);
    }
    .btn-primary-outline:hover{
      background:var(--primary);
      color:#fff;
    }

    .btn-accent-outline{
      border:2px solid var(--accent);
      background:transparent;
      color:var(--accent);
    }
    .btn-accent-outline:hover{
      background:var(--accent);
      color:#fff;
    }

    .container{ 
      max-width:1200px; 
      margin:20px auto; 
      padding:0 16px; 
    }
    .footer{ 
      border-top:1px solid var(--border); 
      color:var(--muted); 
      padding:18px 20px; 
      text-align:center; 
      margin-top:40px; 
      background:#fff; 
    }
  `]
})
export class AppComponent implements OnInit {
  year = new Date().getFullYear();
  isLoggedIn = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Added auto login check
    this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
    this.auth['isLoggedInSubject'].next(!!this.auth.getToken());
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
