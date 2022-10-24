import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products!: [];

  statuses = [
    { label: 'ACTIVO', value: true },
    { label: 'INACTIVO', value: false }
  ]

  first = 0;
  rows = 10;
  addProduct!: boolean;
  editProduct!: boolean;
  viewProduct!: boolean;
  disabled = true;
  nextProduct = 0;

  id = new FormControl({value: '', disabled: true}, [Validators.required]);
  name = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(45)]);
  price = new FormControl(null, [Validators.min(0), Validators.required]);
  amountAvailable = new FormControl(null, [Validators.min(0), Validators.required]);
  description = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  isActive = new FormControl(null, [Validators.required]);

  constructor(
    private productService: ProductService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.productService.findAll().pipe(
      tap(resp => {
        this.products = resp;
        this.nextProduct = resp[resp.length-1].id + 1;
        this.id.setValue(this.nextProduct.toString());
      })
    ).subscribe();
  }

  next() {
    this.first = this.first + this.rows;
  }
  
  reset() {
    this.first = 0;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  isLastPage(): boolean {
    return this.products ? this.first === (this.products.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.products ? this.first === 0 : true;
  }

  formValid(): boolean {
    let isValid = false;

    if (this.name.valid && this.price.valid && this.amountAvailable.valid && this.description.valid) {
      isValid = true
    }

    return isValid;
  }

  save() {
    let productToStore = {
      'name': this.name.value,
      'price': this.price.value,
      'amountAvailable': this.amountAvailable.value,
      'description': this.description.value
    }

    this.productService.save(productToStore).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  update() {
    let productToUpdate = {
      'id': this.id.value,
      'name': this.name.value,
      'price': this.price.value,
      'amountAvailable': this.amountAvailable.value,
      'description': this.description.value,
      'isActive': this.isActive.value
    }

    this.productService.update(productToUpdate).pipe(
      tap(resp => {
        if(resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  openUpdate(id: number) {
    this.productService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.price.setValue(resp.price);
        this.amountAvailable.setValue(resp.amountAvailable);
        this.description.setValue(resp.description);
        this.isActive.setValue(resp.isActive);
        
        this.editProduct = true;
      })
    ).subscribe();
  }

  openView(id: number) {
    this.productService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.price.setValue(resp.price);
        this.amountAvailable.setValue(resp.amountAvailable);
        this.description.setValue(resp.description);
        this.isActive.setValue(resp.isActive);

        this.name.disable();
        this.price.disable();
        this.amountAvailable.disable();
        this.description.disable();
        this.isActive.disable();

        this.viewProduct = true;
      })
    ).subscribe()
  }

  cancel() {
    this.editProduct = false;
    this.addProduct = false;

    this.id.reset(null);
    this.id.setValue(this.nextProduct.toString());
    this.name.reset(null);
    this.price.reset(null);
    this.amountAvailable.reset(null);
    this.description.reset(null);
    this.isActive.reset(null);
  }

  onViewHide() {
    this.id.reset();
    this.id.setValue(this.nextProduct.toString());
    this.name.reset();
    this.price.reset();
    this.amountAvailable.reset();
    this.description.reset();
    this.isActive.reset();

    this.name.enable();
    this.price.enable();
    this.amountAvailable.enable();
    this.description.enable();
    this.isActive.enable();

    this.viewProduct = false;
  }
}
