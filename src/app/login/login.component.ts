import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { EmployeeService } from '../employees/service/employee.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .p-password input {
            width: 100%;
            padding:1rem;
        }

        :host ::ng-deep .pi-eye{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }

        :host ::ng-deep .pi-eye-slash{
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    employeeCode!: number;
    rfc!: string;

    constructor(
        public layoutService: LayoutService,
        private employeeService: EmployeeService,
        private messageService: MessageService,
        private router: Router
    ) {}

    login() {
        let login = {
            'id': this.employeeCode,
            'rfc': this.rfc
        }

        this.employeeService.login(login).pipe(
            tap(resp => {
                if (resp.status === 404) {
                    this.messageService.add({ severity: 'warn', summary: resp.message });
                }

                if (resp.status === 202) {
                    this.messageService.add({ severity: 'success', summary: '¡Bienvenido!', detail: `Hola, ${resp.employee.name}` });
                    sessionStorage.setItem('employeeLogged', JSON.stringify(resp.employee));
                    this.router.navigate(['/products']);
                }
            })
        ).subscribe();
    }
}
