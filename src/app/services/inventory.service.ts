import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface Product {
  name: string;
  code: string;
  amazonNumber: string;
  quantity: number;
}

export interface ShippedProduct {
  name: string;
  code: string;
  amazonNumber: string;
  quantity: number;
  shippedDate: string;
  delivered: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private platformId = inject(PLATFORM_ID);

  private productsKey = 'warehouse_products';
  private shippedProductsKey = 'warehouse_shipped_products';

  products: Product[] = [];
  shippedProducts: ShippedProduct[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedProducts = localStorage.getItem(this.productsKey);
    const savedShippedProducts = localStorage.getItem(this.shippedProductsKey);

    if (savedProducts) {
      this.products = JSON.parse(savedProducts);
    }

    if (savedShippedProducts) {
      this.shippedProducts = JSON.parse(savedShippedProducts);
    }
  }

  private saveData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(this.productsKey, JSON.stringify(this.products));
    localStorage.setItem(this.shippedProductsKey, JSON.stringify(this.shippedProducts));
  }

  isProductCodeExists(code: string): boolean {
    return this.products.some(
      p => p.code.toLowerCase() === code.toLowerCase()
    );
  }

  isProductCodeExistsForOtherProduct(code: string, currentIndex: number): boolean {
    return this.products.some(
      (p, index) => index !== currentIndex && p.code.toLowerCase() === code.toLowerCase()
    );
  }

  addProduct(product: Product): void {
    this.products.push(product);
    this.saveData();
  }

  updateProduct(index: number, product: Product): void {
    this.products[index] = product;
    this.saveData();
  }

  deleteProduct(index: number): void {
    this.products.splice(index, 1);
    this.saveData();
  }

  shipProduct(productIndex: number, shippedQuantity: number, shippedDate: string): boolean {
    const product = this.products[productIndex];

    if (!product) return false;
    if (shippedQuantity <= 0) return false;
    if (shippedQuantity > product.quantity) return false;
    if (!shippedDate) return false;

    product.quantity -= shippedQuantity;

    this.shippedProducts.push({
      name: product.name,
      code: product.code,
      amazonNumber: product.amazonNumber,
      quantity: shippedQuantity,
      shippedDate,
      delivered: false
    });

    this.saveData();
    return true;
  }

  updateShippedProduct(index: number, updatedProduct: ShippedProduct): boolean {
    const oldProduct = this.shippedProducts[index];
    if (!oldProduct) return false;

    const sourceProduct = this.products.find(p => p.code === oldProduct.code);
    if (!sourceProduct) return false;

    const difference = updatedProduct.quantity - oldProduct.quantity;

    if (difference > 0) {
      if (difference > sourceProduct.quantity) {
        return false;
      }
      sourceProduct.quantity -= difference;
    } else if (difference < 0) {
      sourceProduct.quantity += Math.abs(difference);
    }

    this.shippedProducts[index] = { ...updatedProduct };
    this.saveData();
    return true;
  }

  deleteShippedProduct(index: number): void {
    const shipped = this.shippedProducts[index];
    if (!shipped) return;

    const sourceProduct = this.products.find(p => p.code === shipped.code);
    if (sourceProduct) {
      sourceProduct.quantity += shipped.quantity;
    }

    this.shippedProducts.splice(index, 1);
    this.saveData();
  }

  clearAllData(): void {
    this.products = [];
    this.shippedProducts = [];

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.removeItem(this.productsKey);
    localStorage.removeItem(this.shippedProductsKey);
  }
}