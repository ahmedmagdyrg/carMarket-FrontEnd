import { Routes } from '@angular/router';
import { CarListComponent } from './components/car-list/car-list.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { CarFormComponent } from './components/car-form/car-form.component';

// Auth pages
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

// Admin
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard';

// Profile
import { UserProfileComponent } from './components/user-profile/user-profile.component';

// Guards
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  // Default route redirects to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Authentication routes
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'register', component: RegisterComponent, title: 'Register' },

  // Cars routes
  { path: 'cars', component: CarListComponent, title: 'Cars' },
  { path: 'cars/new', component: CarFormComponent, title: 'Add Car' },
  { path: 'cars/:id', component: CarDetailComponent, title: 'Car Details' },
  { path: 'cars/:id/edit', component: CarFormComponent, title: 'Edit Car' },

// User profile routes
{ path: 'profile', component: UserProfileComponent, title: 'My Profile' },
{ path: 'profile/:id', component: UserProfileComponent, canActivate: [adminGuard], title: 'User Profile' },

  // Admin routes
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [adminGuard],
    title: 'Admin Dashboard'
  },

  // Wildcard - redirect unknown routes to login
  { path: '**', redirectTo: '/login' },
];
