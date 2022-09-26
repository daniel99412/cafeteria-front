import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class SupplierService {
    constructor(private httpClient: HttpClient) { }
    
    findAll() {
        return this.httpClient.get<any>(`${AppSettings.API}/supplier/`);
    }

    findById(id: number) {
        return this.httpClient.get<any>(`${AppSettings.API}/supplier/${id}`);
    }

    save(supplier: any) {
        return this.httpClient.post<any>(`${AppSettings.API}/supplier/`, supplier);
    }

    update(supplier: any) {
        return this.httpClient.put<any>(`${AppSettings.API}/supplier/${supplier.id}`, supplier);
    }
}