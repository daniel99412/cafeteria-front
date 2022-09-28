import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class IvaService {
    constructor(private httpClient: HttpClient) { }
    
    findAll() {
        return this.httpClient.get<any>(`${AppSettings.API}/iva/`);
    }

    findById(id: number) {
        return this.httpClient.get<any>(`${AppSettings.API}/iva/${id}`);
    }

    save(iva: any) {
        return this.httpClient.post<any>(`${AppSettings.API}/iva/`, iva);
    }

    update(iva: any) {
        return this.httpClient.put<any>(`${AppSettings.API}/iva/${iva.id}`, iva);
    }
}