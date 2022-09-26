import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    employeeLogged!: any;
    viewEmployee = false;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService, private router: Router) {
        this.employeeLogged = JSON.parse(sessionStorage.getItem('employeeLogged')!);
        if (this.employeeLogged) {
            this.employeeLogged.birthdate = new Date(this.employeeLogged.birthdate);
        }

        this.items = [{
            label: this.employeeLogged ? this.employeeLogged.name : 'Dummy',
            items: [{
                label: 'Ver Perfil',
                icon: 'pi pi-user',
                command: () => {
                    this.viewEmployee = true;
                }
            }, {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => {
                    this.router.navigate(['/login']);
                    sessionStorage.clear();
                }
            }]
        }]
    }
}
