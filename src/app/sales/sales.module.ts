import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesViewComponent } from './sales-view/sales-view.component';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule
  ],
  declarations: [],
})
export class SalesModule { }
