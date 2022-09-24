import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

import { ProductsListComponent } from './products-list.component';
import { ProductsListRoutingModule } from './products-list-routing.module';
import { ProductService } from '../service/product.service';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
  imports: [
    CommonModule,
    ProductsListRoutingModule,
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
  ],
  declarations: [ ProductsListComponent ],
  providers: [ ProductService, MessageService ]
})
export class ProductsListModule { }
