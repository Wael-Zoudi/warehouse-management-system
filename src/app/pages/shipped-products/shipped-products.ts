import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  WarehouseApiService,
  ShippedProduct
} from '../../services/warehouse-api.service';

import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-shipped-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shipped-products.html',
  styleUrl: './shipped-products.css'
})
export class ShippedProducts implements OnInit {

  shippedProducts: ShippedProduct[] = [];
  searchText: string = '';

  constructor(
    private api: WarehouseApiService,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.loadShippedProducts();
  }

  loadShippedProducts(): void {
    this.api.getShippedProducts().subscribe({
      next: (data) => {
        this.shippedProducts = data;
      },
      error: (error) => {
        console.error(error);
        alert('Fehler beim Laden der versendeten Produkte.');
      }
    });
  }

  exportShippedProducts(): void {

    const exportData = this.filteredShippedProducts.map(product => ({
      ID: product.id,
      Produktname: product.name,
      Code: product.code,
      AmazonNummer: product.amazonNumber,
      Menge: product.quantity,
      Versanddatum: product.shippedDate,
      Sendungsnummer: product.shipmentNumber,
      Geliefert: product.delivered ? 'Ja' : 'Nein'
    }));

    this.excelService.exportToExcel(
      exportData,
      'versendete-produkte'
    );
  }

  get filteredShippedProducts(): ShippedProduct[] {
    if (!this.searchText.trim()) {
      return this.shippedProducts;
    }

    const text = this.searchText.toLowerCase();

    return this.shippedProducts.filter(p =>
      p.name.toLowerCase().includes(text) ||
      p.code.toLowerCase().includes(text) ||
      p.amazonNumber.toLowerCase().includes(text) ||
      p.shipmentNumber.toLowerCase().includes(text)
    );
  }

  toggleDelivered(product: ShippedProduct): void {
    this.api.updateDeliveredStatus(product.id, !product.delivered).subscribe({
      next: () => {
        this.loadShippedProducts();
      },
      error: (error) => {
        console.error(error);
        alert('Fehler beim Aktualisieren.');
      }
    });
  }

  deleteProduct(product: ShippedProduct): void {
    const confirmed = confirm(
      `Möchten Sie den Versand von "${product.name}" löschen?`
    );

    if (!confirmed) {
      return;
    }

    this.api.deleteShippedProduct(product.id).subscribe({
      next: () => {
        this.loadShippedProducts();
      },
      error: (error) => {
        console.error(error);
        alert('Fehler beim Löschen.');
      }
    });
  }
}