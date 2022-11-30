import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class PurchaseService {
  constructor(private httpClient: HttpClient) { }
  
  findAll() {
    return this.httpClient.get<any>(`${AppSettings.API}/purchase/`)
  }

  findById(id: number) {
    return this.httpClient.get<any>(`${AppSettings.API}/purchase/${id}`);
  }

  save(purchase: any) {
    return this.httpClient.post<any>(`${AppSettings.API}/purchase/`, purchase);
  }
}