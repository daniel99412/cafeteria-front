import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class ProductIngredientService {
    constructor(private httpClient: HttpClient) { }
    
    findByProduct(product: any) {
        return this.httpClient.get<any>(`${AppSettings.API}/product-ingredient/${product}`);
    }
}