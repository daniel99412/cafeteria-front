import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./iva-list/iva-list.module').then(m => m.IvaListModule) },
      { path: '**', redirectTo: 'list' }
    ])
  ],
  exports: [RouterModule]
})
export class IvaRoutingModule { }
