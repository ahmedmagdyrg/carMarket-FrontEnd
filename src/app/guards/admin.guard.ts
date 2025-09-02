import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const user = auth.getUser();

  // Check token and role
  if (token && user?.role === 'admin') {
    return true;
  } else {
    console.warn('Access denied: not admin or no token');
    router.navigate(['/cars']); 
    return false;
  }
};
