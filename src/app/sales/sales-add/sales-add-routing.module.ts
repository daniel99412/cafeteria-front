import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SalesAddComponent } from './sales-add.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SalesAddComponent }
  ])],
  exports: [RouterModule]
})
export class SalesAddRoutingModule { }
