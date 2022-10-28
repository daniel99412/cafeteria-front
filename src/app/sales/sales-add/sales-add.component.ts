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

export class ProductDetail {
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

  products = [];
  filteredProducts!: any[];
  ivas = [];
  sale: Sale = new Sale();
  productsDetail: ProductDetail[] = [];

  saleIdFc = new FormControl({value: '', disabled: true});
  saleEmplyeeNameFc = new FormControl({ value: '', disabled: true });
  saleDateFc = new FormControl({ value: new Date(), disabled: true });

  chosenProduct = new FormControl(null, [Validators.required]);
  chosenProductAmountAvailable = 0;
  chosenProductPrice = new FormControl({value: null, disabled: true}, [Validators.required]);
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
        this.products = products.filter((p: any) => p.isActive);
        return this.ivaService.findAll();
      }),
      map(ivas => {
        this.ivas = ivas;
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
        this.messageService.add({ severity: 'error', summary: '¡Error!', detail: 'No existe suficiente producto para proveer lo demandado'});
        this.chosenProductAmount.setValue(this.chosenProductAmountAvailable.toString());
      }
    });
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

  addProductDetail() {
    const newPd = new ProductDetail();
    newPd.product = this.chosenProduct.value!;
    newPd.amount = +this.chosenProductAmount.value!;
    newPd.price = +this.chosenProductPrice.value!;

    let already = this.findProductDetailIndex(newPd);

    if (already !== -1) {
      this.productsDetail[already].amount = this.productsDetail[already].amount! + newPd.amount;
    } else {
      this.productsDetail.push(newPd);
    }

    this.chosenProduct.reset();
    this.chosenProductAmountAvailable = 0;
    this.chosenProductPrice.reset();
    this.chosenProductAmount.reset('');
  }

  calculateSubtotal(): number {
    let subtotal = 0;

    if (this.productsDetail.length > 0) {
      this.productsDetail.forEach((p: any) => {
        subtotal = subtotal + (p.amount * p.price)
      });
    }

    return subtotal;
  }

  calculateIva(): number {
    let iva = 0;
    let indexIva = 0;
    let currentIva!: any

    if (this.ivas.length > 0) {
      this.ivas.forEach((i: any, index) => {
        if (moment().isBefore(i.startDate)) indexIva = index;
      })
  
      currentIva = this.ivas[indexIva];
  
      iva = this.calculateSubtotal() * (currentIva.iva / 100)
    }

    return iva;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateIva();
  }

  findProductDetailIndex(productAdded: ProductDetail): number {
    let p = _.findIndex(this.productsDetail, function(o) {
      return o.product.id === productAdded.product.id;
    });

    return p;
  }

  removePd(pd: ProductDetail) {
    this.productsDetail = _.filter(this.productsDetail, function(o) {
      return o.product.id !== pd.product.id;
    });
  }

  saleIsValid(): boolean {
    if (this.productsDetail.length !== 0) {
      return false;
    }
    return true;
  }

  save() {
    const saleToSend = {
      'sale': this.sale,
      'detailsSale': this.productsDetail
    }

    this.saleService.save(saleToSend).pipe(
      tap(resp => {
        localStorage.setItem('message', JSON.stringify(resp));
        
        this.router.navigate(['/sales/list']);
      })
    ).subscribe();
  }
}
