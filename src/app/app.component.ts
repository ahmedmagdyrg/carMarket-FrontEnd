import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  year = new Date().getFullYear();
  isLoggedIn = false;
  isAdmin = false;
  isScrolled = false;
  isDark = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.isAdmin = this.auth.getUserRole() === 'admin';
    });
    this.auth['isLoggedInSubject'].next(!!this.auth.getToken());

    // check saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDark = true;
      document.body.classList.add('dark-theme');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    if (this.isDark) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // helper: check if current route starts with a path
  isCurrentRouteStartsWith(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
