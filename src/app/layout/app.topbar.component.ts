import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService) {
        this.items = [{
            label: 'Chuyin Barajas Jr',
            items: [{
                label: 'Ver Perfil',
                icon: 'pi pi-user',
                command: () => {
                    console.log('Al Perfil')
                }
            }, {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                routerLink: '/login'
            }]
        }]
    }


}
