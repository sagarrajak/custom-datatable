import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee, IHeaders } from '../types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'custom-main-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnDestroy {

  constructor(private http: HttpClient) { }

  private subscription: Subscription;
  public listEmployee: IEmployee[] = [];

  ngOnInit() {
    this.subscription =
      this.http.get<IEmployee[][]>('https://my-json-server.typicode.com/darshanp40/employeedb/employees')
        .subscribe(res => {
          this.listEmployee = [...res[0], ...res[0], ...res[0], ...res[0], ...res[0]];
        }, err => {
          console.error(err);
        });
  }

  public sortFunction(flag: number, key: keyof IHeaders): void {
    this.listEmployee = [...this.listEmployee.sort((lhs: IEmployee, rhs: IEmployee) => {
      switch (key) {
        case 'id': {
          return (+lhs.id) === (+rhs.id) ? 0 : (+lhs.id) < (+rhs.id) ? -1 * flag : flag;
        }
        case 'job_title': {
          return (lhs.jobTitleName) === (rhs.jobTitleName) ? 0 : (lhs.jobTitleName) < (rhs.jobTitleName) ? -1 * flag : flag;
        }
        case 'full_name': {
          const fullNameLhs = (lhs.firstName + ' ' + lhs.lastName);
          const fullNameRhs = (rhs.firstName + ' ' + rhs.lastName);
          return fullNameLhs === fullNameRhs ? 0 : fullNameLhs < fullNameRhs  ? -1 * flag : flag;
        }
        case 'phone_number': {
          return (lhs.phoneNumber) === (rhs.phoneNumber) ? 0 : (lhs.phoneNumber) < (rhs.phoneNumber) ? -1 * flag : flag;
        }
        case 'email': {
          return (lhs.emailAddress) === (rhs.emailAddress) ? 0 : (lhs.emailAddress) < (rhs.emailAddress) ? -1 * flag : flag;
        }
        case 'region': {
          return (lhs.region) === (rhs.region) ? 0 : (lhs.region) < (rhs.region) ? -1 * flag : flag;
        }
        case 'dob': {
          return new Date(lhs.dob) === new Date(rhs.dob) ? 0 : new Date(lhs.dob) < new Date(rhs.dob) ? -1 * flag : flag;
        }
      }
      return 1;
    })];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
