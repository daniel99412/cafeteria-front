import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { IvaService } from '../services/iva.service';
import * as moment from 'moment';

@Component({
  selector: 'app-iva-list',
  templateUrl: './iva-list.component.html',
  styleUrls: ['./iva-list.component.scss']
})
export class IvaListComponent implements OnInit {
  
  ivas!: [];

  first = 0;
  rows = 10;
  addIva!: boolean;
  editIva!: boolean;
  disabled = true;
  nextIva = 0;

  id = new FormControl({value: '', disabled: true}, [Validators.required]);
  iva = new FormControl(null, [Validators.required, Validators.min(0)]);
  dateStart = new FormControl(new Date(), [Validators.required]);

  constructor(
    private ivaService: IvaService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.ivaService.findAll().pipe(
      tap(resp => {
        this.ivas = resp;
        this.nextIva = resp[resp.length-1].id + 1;
        this.id.setValue(this.nextIva.toString());
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
    return this.ivas ? this.first === (this.ivas.length - this.rows) : true;
  }

  isLastPage() {
    return this.ivas ? this.first === 0 : true;
  }

  formValid(): boolean {
    let isValid = false;

    if (this.iva.valid && this.dateStart.valid) {
      isValid = true;
    }

    return isValid;
  }

  openUpdate(id: number) {
    this.ivaService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.iva.setValue(resp.iva);
        this.dateStart.setValue(new Date(resp.dateStart));

        this.editIva = true;
      })
    ).subscribe();
  }

  save() {
    let ivaToStore = {
      'iva': this.iva.value,
      'dateStart': moment(this.dateStart.value).format('YYYY-MM-DD')
    }

    this.ivaService.save(ivaToStore).pipe(
      tap (resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  update() {
    let ivaToStore = {
      'id': this.id.value,
      'iva': this.iva.value,
      'dateStart': moment(this.dateStart.value).format('YYYY-MM-DD')
    }

    this.ivaService.update(ivaToStore).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  cancel() {
    this.id.reset(null);
    this.id.setValue(this.nextIva.toString());
    this.iva.reset(null);
    this.dateStart.reset(null);

    this.addIva = false;
    this.editIva = false;
  }

  displayDate(date: any): string {
    return moment(date).format('DD-MM-YYYY');
  }
}
