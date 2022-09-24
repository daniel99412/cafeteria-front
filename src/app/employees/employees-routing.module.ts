import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'list', loadChildren: () => import('./employees-list/employees-list.module').then(m => m.EmployeesListModule) },
      { path: '**', redirectTo: 'list' }
    ])
  ],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
