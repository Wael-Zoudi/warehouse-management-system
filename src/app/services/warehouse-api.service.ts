import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  code: string;
  amazonNumber: string;
  quantity: number;
  storageLocation: string;
}

export interface CreateProduct {
  name: string;
  code: string;
  amazonNumber: string;
  quantity: number;
  storageLocation: string;
}

export interface ShippedProduct {
  id: number;
  name: string;
  code: string;
  amazonNumber: string;
  quantity: number;
  shippedDate: string;
  delivered: boolean;
  shipmentNumber: string;
}

export interface ShipProductRequest {
  quantity: number;
  shippedDate: string;
  shipmentNumber: string;
}

export interface AppUser {
  id: number;
  username: string;
  role: string;
  isApproved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class WarehouseApiService {
  private apiUrl = 'https://localhost:7173/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: CreateProduct): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/products/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }

  getShippedProducts(): Observable<ShippedProduct[]> {
    return this.http.get<ShippedProduct[]>(`${this.apiUrl}/shippedproducts`);
  }

  shipProduct(productId: number, request: ShipProductRequest): Observable<ShippedProduct> {
    return this.http.post<ShippedProduct>(
      `${this.apiUrl}/shippedproducts/ship/${productId}`,
      request
    );
  }

  updateDeliveredStatus(id: number, delivered: boolean): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/shippedproducts/${id}/delivered`,
      { delivered }
    );
  }

  deleteShippedProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/shippedproducts/${id}`);
  }

  getUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>(`${this.apiUrl}/users`);
  }

  approveUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}/approve`, {});
  }

  rejectUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}/reject`, {});
  }

  makeAdmin(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${id}/make-admin`, {});
  }
}