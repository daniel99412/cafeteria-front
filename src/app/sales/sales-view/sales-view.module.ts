import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesViewComponent } from './sales-view.component';
import { SalesViewRoutingModule } from './sales-view-routing.module';
import { SaleService } from '../service/sale.service';
import { IvaService } from 'src/app/iva/services/iva.service';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CommonModule,
    SalesViewRoutingModule,
    TableModule,
    ButtonModule,
  ],
  declarations: [ SalesViewComponent ],
  providers: [ MessageService, SaleService, IvaService ]
})
export class SalesViewModule { }
