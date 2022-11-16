import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PurchasesAddComponent } from './purchases-add.component';



@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: PurchasesAddComponent },
  ])],
  exports: [RouterModule]
})
export class PurchasesAddRoutingModule { }
