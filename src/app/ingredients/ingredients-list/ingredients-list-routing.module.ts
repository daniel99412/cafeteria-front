import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IngredientsListComponent } from './ingredients-list.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: IngredientsListComponent }
  ])],
  exports: [RouterModule]
})
export class IngredientsListRoutingModule { }
