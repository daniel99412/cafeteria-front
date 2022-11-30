import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { IvaService } from 'src/app/iva/services/iva.service';
import { PurchaseService } from '../service/purchases.service';
import * as moment from 'moment';

@Component({
  selector: 'app-purchases-view',
  templateUrl: './purchases-view.component.html',
  styleUrls: ['./purchases-view.component.scss']
})
export class PurchasesViewComponent implements OnInit {
  purchase!: any;
  ivas = [];

  constructor(
    private route: ActivatedRoute,
    private purchaseService: PurchaseService,
    private ivaService: IvaService
  ) { }

  ngOnInit(): void {
    this.purchaseService.findById(+this.route.snapshot.paramMap.get('id')!).pipe(
      switchMap(purchase => {
        this.purchase = purchase;
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
    this.purchase.detailsPurchase.forEach((ds: any) => {
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
        if (moment(this.purchase.date).isBefore(i.startDate)) indexIva = index;
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
