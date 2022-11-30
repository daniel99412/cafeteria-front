import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchasesViewComponent } from './purchases-view.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: PurchasesViewComponent }
  ])],
  exports: [RouterModule]
})
export class PurchasesViewRoutingModule { }
