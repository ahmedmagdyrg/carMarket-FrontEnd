import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <div class="brand" routerLink="/">AutoLite</div>
      <nav class="actions">
        <a routerLink="/" class="link">Browse</a>
        <a routerLink="/cars/new" class="btn btn-accent">Add Listing</a>
      </nav>
    </header>

    <main class="container">
      <router-outlet />
    </main>

    <footer class="footer">
      <span>© {{year}} AutoLite</span>
    </footer>
  `,
  styles: [`
    :host { --bg:#FFFFFF; --primary:#1DA1F2; --accent:#FF8C42;
            --text:#333333; --muted:#666666; --border:#E0E0E0; }
    .topbar{
      position: sticky; top:0; z-index:10;
      display:flex; justify-content:space-between; align-items:center;
      padding:14px 20px; background:#fff; border-bottom:1px solid var(--border);
    }
    .brand{ font-weight:800; color:var(--primary); cursor:pointer; font-size:20px; }
    .actions{ display:flex; gap:10px; align-items:center; }
    .link{ color:var(--text); text-decoration:none; padding:6px 10px; border-radius:6px; }
    .link:hover{ background:#f7f7f7; }
    .btn{
      border:none; cursor:pointer; color:#fff; padding:10px 14px;
      border-radius:8px; font-weight:600; text-decoration:none;
    }
    .btn-accent{ background:var(--accent); }
    .btn-accent:hover{ opacity:.9; }
    .container{ max-width:1200px; margin:20px auto; padding:0 16px; }
    .footer{
      border-top:1px solid var(--border); color:var(--muted);
      padding:18px 20px; text-align:center; margin-top:40px;
      background:#fff;
    }
  `]
})
export class AppComponent implements OnInit {
  year = new Date().getFullYear();

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/cars']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
