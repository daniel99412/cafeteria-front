import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuppliersListComponent } from './suppliers-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SuppliersListComponent }
  ])],
  exports: [RouterModule]
})
export class SuppliersListRoutingModule { }
