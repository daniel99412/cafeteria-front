import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalesListComponent } from './sales-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SalesListComponent }
  ])],
  exports: [RouterModule]
})
export class SalesListRoutingModule { }
