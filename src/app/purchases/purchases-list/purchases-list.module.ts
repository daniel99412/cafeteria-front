import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesListRoutingModule } from './purchases-list-routing.module';
import { MessageService } from 'primeng/api';
import { SupplierService } from 'src/app/suppliers/service/supplier.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { PurchasesListComponent } from './purchases-list.component';

@NgModule({
  imports: [
    CommonModule,
    PurchasesListRoutingModule,
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
    DropdownModule
  ],
  declarations: [ PurchasesListComponent ],
  providers: [ MessageService, SupplierService ]
})
export class PurchasesListModule { }