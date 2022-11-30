import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { SaleService } from '../service/sale.service';
import * as moment from 'moment';
import { IvaService } from 'src/app/iva/services/iva.service';

@Component({
  selector: 'app-sales-view',
  templateUrl: './sales-view.component.html',
  styleUrls: ['./sales-view.component.scss']
})
export class SalesViewComponent implements OnInit {
  sale!: any;
  ivas = [];

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
    private ivaService: IvaService,
  ) { }

  ngOnInit(): void {
    this.saleService.findById(+this.route.snapshot.paramMap.get('id')!).pipe(
      switchMap(sale => {
        this.sale = sale;
        return this.ivaService.findAll();
      }),
      map(ivas => {
        this.ivas = ivas;
      })
    ).subscribe();
  }

  formatDate(date: any) {
    return moment(date).format('DD-MM-YYYY')
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    this.sale.detailsSale.forEach((ds: any) => {
      subtotal = subtotal + (ds.price * ds.amount);
    })

    return subtotal;
  }

  calculateIva() {
    let iva = 0;
    let indexIva = 0;
    let currentIva!: any

    if (this.ivas.length > 0) {
      this.ivas.forEach((i: any, index) => {
        if (moment(this.sale.date).isBefore(i.startDate)) indexIva = index;
      })

      currentIva = this.ivas[indexIva];

      iva = this.calculateSubtotal() * (currentIva.iva / 100)
    }

    return iva;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateIva();
  }
}
