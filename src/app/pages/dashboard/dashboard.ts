import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  WarehouseApiService,
  Product,
  ShippedProduct,
  AppUser
} from '../../services/warehouse-api.service';

import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  products: Product[] = [];
  shippedProducts: ShippedProduct[] = [];
  users: AppUser[] = [];

  constructor(
    private api: WarehouseApiService,
    public authApi: AuthApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      }
    });

    this.api.getShippedProducts().subscribe({
      next: (data) => {
        this.shippedProducts = data;
      }
    });

    if (this.authApi.getUser()?.role === 'Admin') {
      this.api.getUsers().subscribe({
        next: (data) => {
          this.users = data;
        }
      });
    }
  }

  get totalProducts(): number {
    return this.products.length;
  }

  get totalQuantity(): number {
    return this.products.reduce((sum, p) => sum + p.quantity, 0);
  }

  get lowStockProducts(): number {
    return this.products.filter(p => p.quantity <= 5).length;
  }

  get totalShipments(): number {
    return this.shippedProducts.length;
  }

  get pendingDeliveries(): number {
    return this.shippedProducts.filter(s => !s.delivered).length;
  }

  get pendingUsers(): number {
    return this.users.filter(u => !u.isApproved).length;
  }
}