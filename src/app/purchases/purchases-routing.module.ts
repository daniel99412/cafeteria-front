import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./purchases-list/purchases-list.module').then(m => m.PurchasesListModule) },
      { path: 'add/:id', loadChildren: () => import('./purchases-add/purchases-add.module').then(m => m.PurchasesAddModule) },
      { path: 'view/:id', loadChildren: () => import('./purchases-view/purchases-view.module').then(m => m.PurchasesViewModule) },
      { path: '**', redirectTo: 'list' }
    ])
  ],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }