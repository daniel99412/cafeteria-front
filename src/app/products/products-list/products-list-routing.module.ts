import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ProductsListComponent }
  ])],
  exports: [RouterModule]
})
export class ProductsListRoutingModule { }
