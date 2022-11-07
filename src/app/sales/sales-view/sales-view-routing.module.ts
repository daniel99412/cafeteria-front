import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalesViewComponent } from './sales-view.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component:  SalesViewComponent }
  ])],
  exports: [RouterModule]
})
export class SalesViewRoutingModule { }
