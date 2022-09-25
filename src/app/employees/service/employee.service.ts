import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'src/app/app.settings';

@Injectable({providedIn: 'root'})
export class EmployeeService {
    constructor(private httpClient: HttpClient) { }
    
    findAll() {
        return this.httpClient.get<any>(`${AppSettings.API}/employee/`);
    }

    findById(id: number) {
        return this.httpClient.get<any>(`${AppSettings.API}/employee/${id}`);
    }

    save(employee: any) {
        return this.httpClient.post<any>(`${AppSettings.API}/employee/`, employee);
    }

    update(employee: any) {
        return this.httpClient.put<any>(`${AppSettings.API}/employee/${employee.id}`, employee);
    }
}