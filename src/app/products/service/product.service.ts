import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class ProductService {
    constructor(private httpClient: HttpClient) { }
    
    findAll() {
        return this.httpClient.get<any>(`${AppSettings.API}/product/`);
    }

    save(product: any) {
        return this.httpClient.post<any>(`${AppSettings.API}/product/`, product);
    }
}