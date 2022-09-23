import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./products-list/products-list.module').then(m => m.ProductsListModule) }
    ])
  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
