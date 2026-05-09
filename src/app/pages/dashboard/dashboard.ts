import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

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
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  products: Product[] = [];
  shippedProducts: ShippedProduct[] = [];
  users: AppUser[] = [];

  isLoading = true;

  stockChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Lagerbestand'
      }
    ]
  };

  deliveryChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Geliefert', 'Unterwegs'],
    datasets: [
      {
        data: [0, 0]
      }
    ]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(
    private api: WarehouseApiService,
    public authApi: AuthApiService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.updateStockChart();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });

    this.api.getShippedProducts().subscribe({
      next: (data) => {
        this.shippedProducts = data;
        this.updateDeliveryChart();
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

  updateStockChart(): void {
    const topProducts = this.topStockProducts;

    this.stockChartData = {
      labels: topProducts.map(p => p.name),
      datasets: [
        {
          data: topProducts.map(p => p.quantity),
          label: 'Lagerbestand'
        }
      ]
    };
  }

  updateDeliveryChart(): void {
    const delivered = this.shippedProducts.filter(s => s.delivered).length;
    const pending = this.shippedProducts.filter(s => !s.delivered).length;

    this.deliveryChartData = {
      labels: ['Geliefert', 'Unterwegs'],
      datasets: [
        {
          data: [delivered, pending]
        }
      ]
    };
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

  get lowStockList(): Product[] {
    return this.products
      .filter(p => p.quantity <= 5)
      .sort((a, b) => a.quantity - b.quantity);
  }

  get topStockProducts(): Product[] {
    return [...this.products]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }
}