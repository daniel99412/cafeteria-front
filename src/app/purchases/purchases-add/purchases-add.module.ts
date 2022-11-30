import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';

import { PurchasesAddComponent } from './purchases-add.component';
import { PurchasesAddRoutingModule } from './purchases-add-routing.module';
import { SupplierService } from 'src/app/suppliers/service/supplier.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { IvaService } from 'src/app/iva/services/iva.service';
import { PurchaseService } from '../service/purchases.service';

@NgModule({
  imports: [
    CommonModule,
    PurchasesAddRoutingModule,
    TableModule,
    ButtonModule,
    SidebarModule,
    ToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ToastModule,
    BadgeModule,
    InputSwitchModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
    InputNumberModule
  ],
  declarations: [ PurchasesAddComponent ],
  providers: [ 
    MessageService,
    PurchaseService,
    SupplierService,
    ProductService,
    IvaService
  ]
})
export class PurchasesAddModule { }
