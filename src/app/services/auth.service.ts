import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  checkLogged() {
    if (sessionStorage.getItem('employeeLogged')) {
      return true;
    } else {
      return false;
    }
  }
}
