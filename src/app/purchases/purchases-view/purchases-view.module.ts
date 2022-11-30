import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasesViewComponent } from './purchases-view.component';
import { MessageService } from 'primeng/api';
import { Purchase } from '../purchases-add/purchases-add.component';
import { PurchaseService } from '../service/purchases.service';
import { IvaService } from 'src/app/iva/services/iva.service';
import { PurchasesViewRoutingModule } from './purchases-view-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';



@NgModule({
  imports: [
    CommonModule,
    PurchasesViewRoutingModule,
    TableModule,
    ButtonModule
  ],
  declarations: [ PurchasesViewComponent ],
  providers: [ MessageService, PurchaseService, IvaService ]
})
export class PurchasesViewModule { }
