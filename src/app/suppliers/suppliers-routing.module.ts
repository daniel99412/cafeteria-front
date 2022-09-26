import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./suppliers-list/suppliers-list.module').then(m => m.SuppliersListModule) },
      { path: '**', redirectTo: 'list' }
    ])
  ],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
