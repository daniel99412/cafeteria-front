import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SupplierService } from 'src/app/suppliers/service/supplier.service';
import { ProductService } from 'src/app/products/service/product.service';
import { map, switchMap, tap } from 'rxjs';
import { IvaService } from 'src/app/iva/services/iva.service';
import { FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import { PurchaseService } from '../service/purchases.service';

export class Purchase {
  id?: number;
  supplier?: any;
  date?: string;
}

export class PurchaseDetail {
  idPurchase?: number;
  product?: any;
  price?: number;
  amount?: number;
}

@Component({
  selector: 'app-purchases-add',
  templateUrl: './purchases-add.component.html',
  styleUrls: ['./purchases-add.component.scss']
})
export class PurchasesAddComponent implements OnInit {

  purchase: Purchase = new Purchase();
  purchaseDetails: PurchaseDetail[] = [];

  taxes = [];
  suppliers: any[] = [];
  filteredSuppliers!: any[];
  products: any[] = [];
  filteredProducts!: any[];

  purchaseIdFc = new FormControl({ value: '', disabled: true });
  purchaseDateFc = new FormControl({ value: new Date(), disabled: true });
  supplierNameFc = new FormControl(null, [Validators.required]);
  
  chosenSupplier = new FormControl(null, [Validators.required]);

  chosenProduct = new FormControl(null, [Validators.required]);
  chosenProductPrice = new FormControl(null, [Validators.required, Validators.min(1)]);
  chosenProductAmount = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private messageService: MessageService,
    private productService: ProductService,
    private supplierService: SupplierService,
    private ivaService: IvaService
  ) { }

  ngOnInit(): void {
    this.purchase.id = +this.route.snapshot.paramMap.get('id')!;
    this.purchaseIdFc.setValue(this.purchase.id.toString());
    this.purchase.date = moment(this.purchaseDateFc.value!).format('YYYY-MM-DD HH:mm:SS');

    this.supplierService.findAll().pipe(
      switchMap(suppliers => {
        this.suppliers = suppliers;
        return this.productService.findAll();
      }),
      switchMap(products => {
        this.products = this.setUpProducts(products);
        return this.ivaService.findAll();
      }),
      map(taxes => {
        this.taxes = taxes;
      })
    ).subscribe();

    this.chosenSupplier.valueChanges.subscribe((s: any) => {
      if (s && s.id) {
        this.purchase.supplier = s;
      }
    });
  }

  setUpProducts(products: any[]) {
    return products.filter((p: any) => p.isActive);
  }

  filterProducts(event: any) {
    let query = event.query;
    let filtered: any[] = [];

    this.products.forEach((p: any) => {
      if (p.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(p);
      }
    });

    this.filteredProducts = filtered;
  }

  filterSuppliers(event: any) {
    let query = event.query;
    let filtered: any[] = [];

    this.suppliers.forEach((s: any) => {
      if (s.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(s);
      }
    });

    this.filteredSuppliers = filtered;
  }

  addPurchaseDetail() {
    const newPd = new PurchaseDetail();
    newPd.product = this.chosenProduct.value!;
    newPd.amount = +this.chosenProductAmount.value!;
    newPd.price = +this.chosenProductPrice.value!;

    let already = this.findPurchaseDetailIndex(newPd);

    switch(already) {
      case -1:
        this.purchaseDetails.push(newPd);
        break;
      default:
        this.purchaseDetails[already].amount = this.purchaseDetails[already].amount! + newPd.amount;
        break;
    }

    this.chosenProduct.reset();
    this.chosenProductAmount.reset();
    this.chosenProductPrice.reset();
  }

  removePurchaseDetail(pd: PurchaseDetail) {
    this.purchaseDetails = _.filter(this.purchaseDetails, function (o: any) {
      return o.product.id !== pd.product.id;
    });
  }

  findPurchaseDetailIndex(purchaseDetail: PurchaseDetail) {
    return _.findIndex(this.purchaseDetails, function (o: any) {
      return o.product.id === purchaseDetail.product.id;
    });
  }

  calculateSubtotal(): number {
    let subtotal = 0;
    if (this.purchaseDetails.length > 0) {
      this.purchaseDetails.forEach((p: PurchaseDetail) => {
        subtotal = subtotal + (p.amount! * p.price!)
      });
    }

    return subtotal;
  }

  calculateTaxes(): number {
    let taxes = 0;
    let indexTax = 0;
    let currentTax!: any;

    if (this.taxes.length > 0) {
      this.taxes.forEach((t: any, index) => {
        if (moment().isBefore(t.startDate)) indexTax = index;
      })

      currentTax = this.taxes[indexTax];

      taxes = this.calculateSubtotal() * (currentTax.iva / 100);
    }

    return taxes;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTaxes();
  }

  purchaseIsValid(): boolean {
    if (this.purchaseDetails.length !== 0) {
      return false;
    }
    return true;
  }

  save() {
    const purchaseToSend = {
      'purchase': this.purchase,
      'detailsPurchase': this.purchaseDetails
    }

    this.purchaseService.save(purchaseToSend).pipe(
      tap(resp => {
        let statusProductUpdate = 0;
        this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });

        this.purchaseDetails.forEach((pd: any) => {
          let product = {
            'id': pd.product.id,
            'amountAvailable': pd.product.amountAvailable + pd.amount,
          }

          this.productService.update(product).subscribe(resp => {
            statusProductUpdate = resp.status
          });

        });
        
        this.router.navigate(['/purchases/list']);
        // if (statusProductUpdate === 200) {
        //   this.router.navigate(['/purchases/list']);
        // }
      })
    ).subscribe();
  }
}
