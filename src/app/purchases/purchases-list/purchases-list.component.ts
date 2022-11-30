import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { switchMap, tap } from 'rxjs';
import { IvaService } from 'src/app/iva/services/iva.service';
import { PurchaseService } from '../service/purchases.service';

@Component({
  selector: 'app-purchases-list',
  templateUrl: './purchases-list.component.html',
  styleUrls: ['./purchases-list.component.scss']
})
export class PurchasesListComponent implements OnInit {
  purchases!: any[];
  taxes!: any[];
  nextPurchaseId: number = 1;

  first = 0;
  rows = 10;
  
  constructor(
    private purchaseService: PurchaseService,
    private ivaService: IvaService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }
  
  loadData() {
    this.purchaseService.findAll().pipe(
      switchMap(purchases => {
        this.purchases = purchases;
        return this.ivaService.findAll();
      }),
      tap(taxes => {
        this.taxes = taxes;
      })
    ).subscribe();
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  next() {
    this.first = this.first + this.rows;
  }

  isFirstPage() {
    return this.purchases ? this.first === (this.purchases.length - this.rows) : true;
  }

  isLastPage() {
    return this.purchases ? this.first === 0 : true;
  }

  formatDate(date: any): string {
    return moment(date).format('DD-MM-YYYY');
  }


  calculateSubtotal(purchase: any): number {
    let subtotal = 0;

    if (purchase.detailsPurchase.length > 0) {
      purchase.detailsPurchase.forEach((p: any) => {
        subtotal = subtotal + (p.amount * p.price)
      });
    }

    return subtotal;
  }

  calculateIva(purchase: any): number {
    let iva = 0;
    let indexIva = 0;
    let currentIva!: any

    if (this.taxes && this.taxes.length > 0) {
      this.taxes.forEach((i: any, index) => {
        if (moment(purchase.date).isAfter(i.startDate)) indexIva = index;
      })

      currentIva = this.taxes[indexIva];

      iva = this.calculateSubtotal(purchase) * (currentIva.iva / 100)
    }

    return iva;
  }

  calculateTotal(purchase: any): number {
    return this.calculateSubtotal(purchase) + this.calculateIva(purchase);
  }
}
