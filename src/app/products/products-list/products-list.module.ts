import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { ProductsListRoutingModule } from './products-list-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProductsListRoutingModule
  ],
  declarations: [ProductsListComponent]
})
export class ProductsListModule { }
