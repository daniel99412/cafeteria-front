import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmployeesListComponent } from './employees-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: EmployeesListComponent }
  ])],
  exports: [RouterModule]
})
export class EmployeesListRoutingModule { }
