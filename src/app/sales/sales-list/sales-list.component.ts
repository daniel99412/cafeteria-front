import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { SaleService } from '../service/sale.service';
import * as moment from 'moment';
import { IvaService } from 'src/app/iva/services/iva.service';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss']
})
export class SalesListComponent implements OnInit {
  sales!: any[];
  ivas!: any[];
  nextSaleId: number = 1;

  first = 0;
  rows = 10;

  constructor (
    private saleService: SaleService,
    private ivaService: IvaService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.saleService.findAll().pipe(
      switchMap(sales => {
        this.sales = sales;
        if (sales.length > 0) {
          this.nextSaleId = sales[sales.length - 1].id + 1;
        }
        return this.ivaService.findAll();
      }),
      tap(ivas => {
        this.ivas = ivas;
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
    return this.sales ? this.first === (this.sales.length - this.rows) : true;
  }

  isLastPage() {
    return this.sales ? this.first === 0 : true;
  }

  formatDate(date: any): string {
    return moment(date).format('DD-MM-YYYY');
  }

  calculateSubtotal(sale: any): number {
    let subtotal = 0;

    if (sale.detailsSale.length > 0) {
      sale.detailsSale.forEach((p: any) => {
        subtotal = subtotal + (p.amount * p.price)
      });
    }

    return subtotal;
  }

  calculateIva(sale: any): number {
    let iva = 0;
    let indexIva = 0;
    let currentIva!: any

    if (this.ivas && this.ivas.length > 0) {
      this.ivas.forEach((i: any, index) => {
        if (moment(sale.date).isAfter(i.startDate)) indexIva = index;
      })

      currentIva = this.ivas[indexIva];

      iva = this.calculateSubtotal(sale) * (currentIva.iva / 100)
    }

    return iva;
  }

  calculateTotal(sale: any): number {
    return this.calculateSubtotal(sale) + this.calculateIva(sale);
  }

}
