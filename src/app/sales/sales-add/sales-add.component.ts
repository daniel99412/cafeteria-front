import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { map, switchMap, tap } from 'rxjs';
import { IvaService } from 'src/app/iva/services/iva.service';
import { ProductService } from 'src/app/products/service/product.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SaleService } from '../service/sale.service';
import { ActivatedRoute, Router } from '@angular/router';

export class Sale {
  id?: number;
  employee?: any;
  date?: string;
}

export class SaleDetail {
  idSell?: number;
  product?: any;
  price?: number;
  amount?: number;
}

@Component({
  selector: 'app-sales-add',
  templateUrl: './sales-add.component.html',
  styleUrls: ['./sales-add.component.scss']
})
export class SalesAddComponent implements OnInit {

  sale: Sale = new Sale();
  products: any[] = [];
  taxes = [];
  filteredProducts!: any[];
  saleDetails: SaleDetail[] = [];

  saleIdFc = new FormControl({ value: '', disabled: true });
  saleEmplyeeNameFc = new FormControl({ value: '', disabled: true });
  saleDateFc = new FormControl({ value: new Date(), disabled: true });

  chosenProduct = new FormControl(null, [Validators.required]);
  chosenProductAmountAvailable = 0;
  chosenProductPrice = new FormControl({ value: null, disabled: true }, [Validators.required]);
  chosenProductAmount = new FormControl('', [Validators.required, Validators.min(1)]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private saleService: SaleService,
    private productService: ProductService,
    private ivaService: IvaService
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('employeeLogged')) {
      this.sale.id = +this.route.snapshot.paramMap.get('id')!;
      this.sale.employee = JSON.parse(sessionStorage.getItem('employeeLogged')!);
      this.sale.date = moment(this.saleDateFc.value!).format('YYYY-MM-DD HH:mm:SS');

      this.saleIdFc.setValue(this.sale.id.toString());
      this.saleEmplyeeNameFc.setValue(this.sale.employee.name);
    }

    this.productService.findAll().pipe(
      switchMap(products => {
        this.products = this.setUpProducts(products);
        return this.ivaService.findAll();
      }),
      map(ivas => {
        this.taxes = ivas;
      })
    ).subscribe();

    this.chosenProduct.valueChanges.subscribe((p: any) => {
      if (p && p.price) {
        this.chosenProductAmountAvailable = p.amountAvailable;
        this.chosenProductPrice.setValue(p!.price.toString());
      }
    });

    this.chosenProductAmount.valueChanges.subscribe((amount: any) => {
      if (amount > this.chosenProductAmountAvailable) {
        this.messageService.add({ severity: 'error', summary: '¡Error!', detail: 'No existe suficiente producto para proveer lo demandado' });
        this.chosenProductAmount.setValue(this.chosenProductAmountAvailable.toString());
      }
    });
  }

  setUpProducts(products: any[]) {
    return products.filter((p: any) => p.isActive && p.amountAvailable !== 0);
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

  addSaleDetail() {
    const newSd = new SaleDetail();
    newSd.product = this.chosenProduct.value!;
    newSd.amount = +this.chosenProductAmount.value!;
    newSd.price = +this.chosenProductPrice.value!;
    const productIndx = this.findProductIndex(newSd.product);
    this.products[productIndx].amountAvailable = this.products[productIndx].amountAvailable - newSd.amount;

    let already = this.findSaleDetailIndex(newSd);

    switch (already) {
      case -1:
        this.saleDetails.push(newSd);
        break;
      default:
        this.saleDetails[already].amount = this.saleDetails[already].amount! + newSd.amount;
        break;
    }

    this.products = this.setUpProducts(this.products);

    this.chosenProduct.reset();
    this.chosenProductAmountAvailable = 0;
    this.chosenProductPrice.reset();
    this.chosenProductAmount.reset('');
  }

  removeSaleDetail(sd: SaleDetail) {
    const productIndx = this.findProductIndex(sd.product);
    this.products[productIndx].amountAvailable = this.products[productIndx].amountAvailable + sd.amount;

    this.products = this.setUpProducts(this.products);

    this.saleDetails = _.filter(this.saleDetails, function (o) {
      return o.product.id !== sd.product.id;
    });
  }

  findSaleDetailIndex(productAdded: SaleDetail): number {
    let p = _.findIndex(this.saleDetails, function (o) {
      return o.product.id === productAdded.product.id;
    });

    return p;
  }

  findProductIndex(product: any): number {
    return _.findIndex(this.products, function (o: any) { return o.id === product.id });
  }

  calculateSubtotal(): number {
    let subtotal = 0;

    if (this.saleDetails.length > 0) {
      this.saleDetails.forEach((p: any) => {
        subtotal = subtotal + (p.amount * p.price)
      });
    }

    return subtotal;
  }

  calculateTaxes(): number {
    let tax = 0;
    let indexTaxes = 0;
    let currentTax!: any

    if (this.taxes.length > 0) {
      this.taxes.forEach((i: any, index) => {
        if (moment().isBefore(i.startDate)) indexTaxes = index;
      })

      currentTax = this.taxes[indexTaxes];

      tax = this.calculateSubtotal() * (currentTax.iva / 100)
    }

    return tax;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTaxes();
  }

  saleIsValid(): boolean {
    if (this.saleDetails.length !== 0) {
      return false;
    }
    return true;
  }

  save() {
    const saleToSend = {
      'sale': this.sale,
      'detailsSale': this.saleDetails
    }

    this.saleService.save(saleToSend).pipe(
      tap(resp => {
        let statusProductUpdate = 0;
        this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });

        this.saleDetails.forEach((pd: any) => {
          let product = {
            'id': pd.product.id,
            'amountAvailable': pd.product.amountAvailable - pd.amount,
          }

          this.productService.update(product).subscribe(resp => {
            statusProductUpdate = resp.status
          });
        });

        if (statusProductUpdate === 200) {
          this.router.navigate(['/sales/list']);
        }
      })
    ).subscribe();
  }
}
