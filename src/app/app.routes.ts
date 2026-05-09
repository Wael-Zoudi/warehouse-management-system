import { Routes } from '@angular/router';

import { Products } from './pages/products/products';
import { ShippedProducts } from './pages/shipped-products/shipped-products';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminUsers } from './pages/admin-users/admin-users';

import { authGuard } from './services/auth.guard';
import { guestGuard } from './services/guest.guard';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  { path: '', component: Products, canActivate: [authGuard] },
  { path: 'shipped-products', component: ShippedProducts, canActivate: [authGuard] },

  {
    path: 'admin-users',
    component: AdminUsers,
    canActivate: [authGuard, adminGuard]
  },

  { path: '**', redirectTo: '' }
];