import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { EmployeeService } from '../service/employee.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  @ViewChild('employeesDt') employeDt: Table | undefined;

  positions = [
    'Elige una opción',
    'Cajero',
    'Barista',
    'Gerente'
  ]

  positionsFilter = [
    { label: 'Cajero', value: 'Cajero' },
    { label: 'Barista', value: 'Barista' },
    { label: 'Gerente', value: 'Gerente' }
  ]

  statuses = [
    {label: 'ACTIVO', value: true},
    {label: 'INACTIVO', value: false}
  ]

  employees!: [];

  first = 0;
  rows = 10;
  addEmployee!: boolean;
  editEmployee!: boolean;
  viewEmployee!: boolean;
  disabled = true;
  nextEmployee = 0;

  id = new FormControl({value: '', disabled: true}, [Validators.required]);
  name = new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
  rfc = new FormControl(null, [Validators.required, Validators.maxLength(13)]);
  birthdate = new FormControl(new Date(), [Validators.required]);
  address = new FormControl(null, [Validators.required, Validators.maxLength(200)]);
  telephone = new FormControl(null, [Validators.required, Validators.minLength(10)]);
  position = new FormControl(null, [Validators.required]);
  isActive = new FormControl(null, [Validators.required]);

  constructor(
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.employeeService.findAll().pipe(
      tap(resp => {
        this.employees = resp;
        this.nextEmployee = resp[resp.length - 1].id + 1;
        this.id.setValue(this.nextEmployee.toString());
      })
    ).subscribe();
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  next() {
    this.first = this.first + this.rows;
  }

  isFirstPage() {
    return this.employees ? this.first === (this.employees.length - this.rows) : true;
  }

  isLastPage() {
    return this.employees ? this.first === 0 : true;
  }

  formValid(): boolean {
    let isValid = false;

    if (this.name.valid && this.rfc.valid && this.birthdate.valid && this.address.valid && this.telephone.valid && this.position.valid) {
      isValid = true;
    }

    return isValid;
  }

  openUpdate(id: number) {
    this.employeeService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.rfc.setValue(resp.rfc.toUpperCase());
        this.birthdate.setValue(new Date(resp.birthdate));
        this.address.setValue(resp.address);
        this.telephone.setValue(resp.telephone);
        this.position.setValue(resp.position);
        this.isActive.setValue(resp.isActive);

        this.editEmployee = true;
      })
    ).subscribe();
  }

  openView(id: number) {
    this.employeeService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.rfc.setValue(resp.rfc.toUpperCase());
        this.birthdate.setValue(new Date(resp.birthdate));
        this.address.setValue(resp.address);
        this.telephone.setValue(resp.telephone);
        this.position.setValue(resp.position);
        this.isActive.setValue(resp.isActive);

        this.name.disable();
        this.rfc.disable();
        this.birthdate.disable();
        this.address.disable();
        this.telephone.disable();
        this.position.disable();
        this.isActive.disable();

        this.viewEmployee = true;
      })
    ).subscribe();
  }

  save() {
    let employeeToStore = {
      'name': this.name.value,
      'rfc': this.rfc.value,
      'birthdate': moment(this.birthdate.value).format('YYYY-MM-DD'),
      'address': this.address.value,
      'telephone': this.telephone.value,
      'position': this.position.value
    }

    this.employeeService.save(employeeToStore).pipe(
      tap(resp => {
        if(resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Èxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  update() {
    let employeeToStore = {
      'id': this.id.value,
      'name': this.name.value,
      'rfc': this.rfc.value,
      'birthdate': moment(this.birthdate.value).format('YYYY-MM-DD'),
      'address': this.address.value,
      'telephone': this.telephone.value,
      'position': this.position.value,
      'isActive': this.isActive.value
    }

    this.employeeService.update(employeeToStore).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Èxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  cancel() {
    this.id.reset(null);
    this.id.setValue(this.nextEmployee.toString());
    this.name.reset(null);
    this.rfc.reset(null);
    this.birthdate.reset(null);
    this.address.reset(null);
    this.telephone.reset(null);
    this.position.reset(null);
    this.isActive.reset(null);

    this.editEmployee = false;
    this.addEmployee = false;
  }

  onViewHide() {
    this.id.reset(null);
    this.id.setValue(this.nextEmployee.toString());
    this.name.reset(null);
    this.rfc.reset(null);
    this.birthdate.reset(null);
    this.address.reset(null);
    this.telephone.reset(null);
    this.position.reset(null);
    this.isActive.reset(null);
    
    this.name.enable();
    this.rfc.enable();
    this.birthdate.enable();
    this.address.enable();
    this.telephone.enable();
    this.position.enable();
    this.isActive.enable();

    this.viewEmployee = false;
  }
}
