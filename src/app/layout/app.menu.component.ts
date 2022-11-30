import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    employee: any;
    model: any[] = [];
    modelBarista: any[] = [{
        label: 'Home',
        items: [
            { label: 'Ventas', icon: 'pi pi-cart-plus', routerLink: ['sales/list'] },
            { label: 'Compras', icon: 'pi pi-cart-plus', routerLink: ['purchases/list'] },
            { label: 'Productos', icon: 'pi pi-box ', routerLink: ['products/list'] },
            { label: 'Ingredientes', icon: 'pi pi-shopping-cart', routerLink: ['ingredients/list'] },
        ]
    }];

    modelGerente: any[] = [{
        label: 'Home',
        items: [
            // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
            { label: 'Ventas', icon: 'pi pi-cart-plus', routerLink: ['sales/list'] },
            { label: 'Compras', icon: 'pi pi-cart-plus', routerLink: ['purchases/list'] },
            { label: 'Productos', icon: 'pi pi-box ', routerLink: ['products/list'] },
            { label: 'Empleados', icon: 'pi pi-id-card', routerLink: ['employees/list'] },
            { label: 'Proveedores', icon: 'pi pi-shopping-bag', routerLink: ['suppliers/list'] },
            { label: 'Ingredientes', icon: 'pi pi-shopping-cart', routerLink: ['ingredients/list'] },
            { label: 'IVA', icon: 'pi pi-percentage', routerLink: ['iva/list'] },
        ]
    }];

    modelCajero: any[] = [{
        label: 'Home',
        items: [
            { label: 'Ventas', icon: 'pi pi-cart-plus', routerLink: ['sales/list'] }
        ]
    }]

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        
        if (sessionStorage.getItem('employeeLogged')) {
            this.employee = JSON.parse(sessionStorage.getItem('employeeLogged')!);
            
            switch(this.employee.position) {
                case 'Gerente':
                    this.model = this.modelGerente;
                    break;
                case 'Barista':
                    this.model = this.modelBarista;
                    break;
                case 'Cajero':
                    this.model = this.modelCajero;
                    break;
                default:
                    this.model = this.modelCajero;
                    break;
            }
        }
    }
}
