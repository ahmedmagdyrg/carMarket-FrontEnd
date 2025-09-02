import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const userRole = auth.getUserRole();

  if (token && userRole === 'admin') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
