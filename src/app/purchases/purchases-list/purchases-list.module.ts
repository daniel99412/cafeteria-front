import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesListRoutingModule } from './purchases-list-routing.module';
import { MessageService } from 'primeng/api';
import { SupplierService } from 'src/app/suppliers/service/supplier.service';

@NgModule({
  imports: [
    CommonModule,
    PurchasesListRoutingModule
  ],
  declarations: [],
  providers: [ MessageService, SupplierService ]
})
export class PurchasesListModule { }