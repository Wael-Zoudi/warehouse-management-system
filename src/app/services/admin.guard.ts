import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';

export const adminGuard: CanActivateFn = () => {
  const authApi = inject(AuthApiService);
  const router = inject(Router);

  const user = authApi.getUser();

  if (user && user.role === 'Admin') {
    return true;
  }

  return router.createUrlTree(['/']);
};