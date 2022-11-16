import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PurchasesListComponent } from './purchases-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: PurchasesListComponent }
  ])],
  exports: [RouterModule]
})
export class PurchasesListRoutingModule { }
