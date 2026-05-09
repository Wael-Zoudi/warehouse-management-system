import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  WarehouseApiService,
  Product,
  CreateProduct
} from '../../services/warehouse-api.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit {
  products: Product[] = [];
  searchText: string = '';

  newProduct: CreateProduct = {
    name: '',
    code: '',
    amazonNumber: '',
    quantity: 0,
    storageLocation: ''
  };

  editIndex: number | null = null;
  selectedProductId: number | null = null;

  shippingIndex: number | null = null;
  shippingProductId: number | null = null;

  shippingData = {
    quantity: 0,
    shippedDate: '',
    shipmentNumber: ''
  };

  constructor(private api: WarehouseApiService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private showMessage(message: string): void {
    if (typeof window !== 'undefined') {
      window.alert(message);
    }
  }

  loadProducts(): void {
    this.api.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: () => {
        this.showMessage('Fehler beim Laden der Produkte.');
      }
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchText.trim()) {
      return this.products;
    }

    const text = this.searchText.toLowerCase();

    return this.products.filter(product =>
      product.name.toLowerCase().includes(text) ||
      product.code.toLowerCase().includes(text) ||
      product.amazonNumber.toLowerCase().includes(text) ||
      product.storageLocation.toLowerCase().includes(text)
    );
  }

  addOrUpdateProduct(): void {
    if (
      !this.newProduct.name.trim() ||
      !this.newProduct.code.trim() ||
      !this.newProduct.amazonNumber.trim() ||
      !this.newProduct.storageLocation.trim() ||
      this.newProduct.quantity <= 0
    ) {
      this.showMessage('Bitte alle Felder korrekt ausfüllen.');
      return;
    }

    if (this.selectedProductId === null) {
      this.api.createProduct(this.newProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
        },
        error: () => {
          this.showMessage('Fehler beim Hinzufügen des Produkts.');
        }
      });
    } else {
      const updatedProduct: Product = {
        id: this.selectedProductId,
        name: this.newProduct.name,
        code: this.newProduct.code,
        amazonNumber: this.newProduct.amazonNumber,
        quantity: this.newProduct.quantity,
        storageLocation: this.newProduct.storageLocation
      };

      this.api.updateProduct(updatedProduct).subscribe({
        next: () => {
          this.loadProducts();
          this.resetForm();
        },
        error: () => {
          this.showMessage('Fehler beim Aktualisieren des Produkts.');
        }
      });
    }
  }

  editProduct(product: Product): void {
    const index = this.products.indexOf(product);

    this.editIndex = index;
    this.selectedProductId = product.id;

    this.newProduct = {
      name: product.name,
      code: product.code,
      amazonNumber: product.amazonNumber,
      quantity: product.quantity,
      storageLocation: product.storageLocation
    };
  }

  deleteProduct(product: Product): void {
    if (typeof window === 'undefined') {
      return;
    }

    const confirmed = window.confirm(`Möchten Sie das Produkt "${product.name}" löschen?`);

    if (!confirmed) {
      return;
    }

    this.api.deleteProduct(product.id).subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
      },
      error: () => {
        this.showMessage('Fehler beim Löschen des Produkts.');
      }
    });
  }

  prepareShipping(product: Product): void {
    const index = this.products.indexOf(product);

    this.shippingIndex = index;
    this.shippingProductId = product.id;

    this.shippingData = {
      quantity: 0,
      shippedDate: '',
      shipmentNumber: ''
    };
  }

  confirmShipping(): void {
    if (this.shippingProductId === null) {
      this.showMessage('Bitte zuerst ein Produkt zum Versenden auswählen.');
      return;
    }

    if (
      this.shippingData.quantity <= 0 ||
      !this.shippingData.shippedDate ||
      !this.shippingData.shipmentNumber.trim()
    ) {
      this.showMessage('Bitte Menge, Versanddatum und Sendungsnummer korrekt ausfüllen.');
      return;
    }

    this.api.shipProduct(this.shippingProductId, {
      quantity: this.shippingData.quantity,
      shippedDate: this.shippingData.shippedDate,
      shipmentNumber: this.shippingData.shipmentNumber.trim()
    }).subscribe({
      next: () => {
        this.loadProducts();
        this.cancelShipping();
      },
      error: () => {
        this.showMessage('Versand fehlgeschlagen. Bitte Menge prüfen.');
      }
    });
  }

  cancelShipping(): void {
    this.shippingIndex = null;
    this.shippingProductId = null;

    this.shippingData = {
      quantity: 0,
      shippedDate: '',
      shipmentNumber: ''
    };
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      code: '',
      amazonNumber: '',
      quantity: 0,
      storageLocation: ''
    };

    this.editIndex = null;
    this.selectedProductId = null;
  }
}