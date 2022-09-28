import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class IngredientService {
    constructor(private httpClient: HttpClient) { }
    
    findAll() {
        return this.httpClient.get<any>(`${AppSettings.API}/ingredient/`);
    }

    findById(id: number) {
        return this.httpClient.get<any>(`${AppSettings.API}/ingredient/${id}`);
    }

    save(ingredient: any) {
        return this.httpClient.post<any>(`${AppSettings.API}/ingredient/`, ingredient);
    }

    update(ingredient: any) {
        return this.httpClient.put<any>(`${AppSettings.API}/ingredient/${ingredient.id}`, ingredient);
    }
}