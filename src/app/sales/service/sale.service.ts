import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class SaleService {
  constructor(private httpClient: HttpClient) { }
  
  findAll() {
    return this.httpClient.get<any>(`${AppSettings.API}/sale/`);
  }

  findById(id: number) {
    return this.httpClient.get<any>(`${AppSettings.API}/sale/${id}`);
  }

  save(sale: any) {
    return this.httpClient.post<any>(`${AppSettings.API}/sale/`, sale);
  }
}