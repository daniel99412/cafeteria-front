import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IvaListComponent } from './iva-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: IvaListComponent },
  ])],
  exports: [RouterModule]
})
export class IvaListRoutingModule { }
