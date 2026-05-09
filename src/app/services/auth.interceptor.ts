import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthApiService } from './auth-api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApi = inject(AuthApiService);
  const token = authApi.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  return next(req);
};