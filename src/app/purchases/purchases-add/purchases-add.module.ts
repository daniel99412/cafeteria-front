import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesAddRoutingModule } from './purchases-add-routing.module';
import { MessageService } from 'primeng/api';
import { SupplierService } from 'src/app/suppliers/service/supplier.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PurchasesAddRoutingModule
  ],
  providers: [MessageService, SupplierService]

})
export class PurchasesAddModule { }
