import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./sales-list/sales-list.module').then(m => m.SalesListModule) },
      { path: 'add/:id', loadChildren: () => import('./sales-add/sales-add.module').then(m => m.SalesAddModule) },
      { path: '**', redirectTo: 'list' }
    ])
  ],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
