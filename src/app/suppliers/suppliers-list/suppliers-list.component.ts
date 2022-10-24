import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { SupplierService } from '../service/supplier.service';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.scss']
})
export class SuppliersListComponent implements OnInit {

  suppliers!: [];

  first = 0;
  rows = 10;
  addSupplier!: boolean;
  editSupplier!: boolean;
  viewSupplier!: boolean;
  disabled = true;
  nextSupplier = 0;

  id = new FormControl({value: '', disabled: true}, [Validators.required]);
  name = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  address = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]);
  telephone = new FormControl(null, [Validators.required, Validators.minLength(10)]);
  rfc = new FormControl(null, [Validators.required, Validators.minLength(13)]);

  constructor(
    private supplierService: SupplierService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.supplierService.findAll().pipe(
      tap(resp => {
        this.suppliers = resp;
        this.nextSupplier = resp[resp.length - 1].id + 1;
        this.id.setValue(this.nextSupplier.toString());
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
    return this.suppliers ? this.first === (this.suppliers.length - this.rows) : true;
  }

  isLastPage() {
    return this.suppliers ? this.first === 0 : true;
  }

  formValid(): boolean {
    let isValid = false;

    if (this.name.valid && this.rfc.valid && this.address.valid && this.telephone.valid ) {
      isValid = true;
    }

    return isValid;
  }

  openUpdate(id: number) {
    this.supplierService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.rfc.setValue(resp.rfc.toUpperCase());
        this.address.setValue(resp.address);
        this.telephone.setValue(resp.telephone);
        
        this.editSupplier = true;
      })
    ).subscribe();
  }

  openView(id: number) {
    this.supplierService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.rfc.setValue(resp.rfc.toUpperCase());
        this.address.setValue(resp.address);
        this.telephone.setValue(resp.telephone);

        this.name.disable();
        this.rfc.disable();
        this.address.disable();
        this.telephone.disable();
        
        this.viewSupplier = true;
      })
    ).subscribe();
  }

  save() {
    let supplierToStore = {
      'name': this.name.value,
      'rfc': this.rfc.value,
      'address': this.address.value,
      'telephone': this.telephone.value,
    }
    
    this.supplierService.save(supplierToStore).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Èxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }

        if (resp.status === 500) {
          this.messageService.add({ severity: 'error', summary: '¡Error!', detail: resp.message });
        }
      })
    ).subscribe();
  }

  update() {
    let supplierToStore = {
      'id': this.id.value,
      'name': this.name.value,
      'rfc': this.rfc.value,
      'address': this.address.value,
      'telephone': this.telephone.value
    }

    this.supplierService.update(supplierToStore).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Èxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }

        if (resp.status === 500) {
          this.messageService.add({ severity: 'error', summary: '¡Error!', detail: resp.message });
        }
      })
    ).subscribe();
  }

  cancel() {
    this.id.reset(null);
    this.id.setValue(this.nextSupplier.toString());
    this.name.reset(null);
    this.rfc.reset(null);
    this.address.reset(null);
    this.telephone.reset(null);

    this.editSupplier = false;
    this.addSupplier = false;
  }

  onViewHide() {
    this.id.reset(null);
    this.id.setValue(this.nextSupplier.toString());
    this.name.reset(null);
    this.rfc.reset(null);
    this.address.reset(null);
    this.telephone.reset(null);

    this.name.enable();
    this.rfc.enable();
    this.address.enable();
    this.telephone.enable();

    this.viewSupplier = false;
  }
}
