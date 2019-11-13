import { Injectable } from '@angular/core';
import { IEmployee } from './types';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor() { }

  private primaryKeysEmployee: number[] = [];

  set Employee(employees: IEmployee[]) {
    this.primaryKeysEmployee = employees.map(employee => {
      return +employee.id;
    });
  }

  public isIdPresent(id: number|string): boolean {
    const index = this.primaryKeysEmployee.findIndex(keyId => id === +keyId);
    return index >= 0 ? true : false;
  }
}
