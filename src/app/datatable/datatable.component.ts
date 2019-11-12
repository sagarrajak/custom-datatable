import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee, IHeaders } from '../types';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'custom-main-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private http: HttpClient) { }

  private subscription: Subscription;
  public listEmployee: IEmployee[] = []; // table which is currenty vissible
  public backupListEmployee: IEmployee[] = []; // cached version of table
  public searchBackupEmployee: IEmployee[] = []; // a backup version for search
  public searchControl = new FormControl();

  public activePaginationIndex: number = 1;
  public paginationList: number[] = [];
  public paginationListSlice: number[] = [];

  public showAddEmployeeDialog: boolean = false;

  ngOnInit() {
    this.subscription =
      this.http.get<IEmployee[][]>('https://my-json-server.typicode.com/darshanp40/employeedb/employees')
        .subscribe(res => {
          this.backupListEmployee = [...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0], ...res[0],
          ...res[0], ...res[0], ...res[0], ...res[0]];
          this.searchBackupEmployee = [...this.backupListEmployee];
          this.setPaginationFirstTime();
        }, err => {
          console.error(err);
        });
  }

  private setPaginationFirstTime(): void {
    if (this.backupListEmployee.length > 10) {
      for (let i = 0, j = 1; i < this.backupListEmployee.length; i += 10) {
        this.paginationList.push(j++);
      }
    } else {
      this.paginationList.push(1);
    }
    if (this.paginationList.length > 3) {
      this.paginationListSlice = this.paginationList.slice(0, 4);
    } else {
      this.paginationListSlice = [...this.paginationList];
    }
    this.setCurrentPagination(1); // first time setting up pagination
  }


  public setPaginationBackWard(): void {
    const firstPaginationIndex: number = this.paginationListSlice[0];
    if (firstPaginationIndex - 1 <= 0) { return; } else {
      // remove top element from list and inset element in front
      this.paginationListSlice.unshift(this.paginationListSlice[0] - 1);
      this.paginationListSlice.pop();
    }
    this.setCurrentPagination(this.paginationListSlice[0]);
  }

  public setPaginationForward(): void {
    // moving forward in pagination
    const lastPaginationIndex: number = this.paginationListSlice[this.paginationListSlice.length - 1];
    if (lastPaginationIndex + 1 > this.paginationList[this.paginationList.length - 1] ) { return; } else {
      this.paginationListSlice.push(lastPaginationIndex + 1);
      this.paginationListSlice.splice(0, 1);
    }
    this.setCurrentPagination(this.paginationListSlice[this.paginationListSlice.length - 1]);
  }

  public sortFunction(flag: number, key: keyof IHeaders): void {
    this.backupListEmployee = [...this.backupListEmployee.sort((lhs: IEmployee, rhs: IEmployee) => {
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
    this.setPaginationFirstTime();
  }

  ngAfterViewInit(): void {
    this.searchControl
    .valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map(data => (data).trim().toLowerCase())
       ).subscribe(query => {
          if (query) {
              this.backupListEmployee =  [...this.searchBackupEmployee.filter((employee: IEmployee) => {
                if (String(employee.id).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.jobTitleName).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.firstName + ' ' + employee.lastName).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.phoneNumber).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.emailAddress).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.region).toLowerCase().indexOf(query) !== -1 ) { return true; }
                if (String(employee.dob).toLowerCase().indexOf(query) !== -1 ) { return true; }
                return false;
              })];
          } else {
            this.backupListEmployee = [...this.searchBackupEmployee];
          }
          this.setPaginationFirstTime();
       });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * @param i
   * Method will set pagination
   */
  setCurrentPagination(i: number): void {
    this.activePaginationIndex = i;
    this.listEmployee = this.backupListEmployee.slice( i * 10 - 10 , i * 10);
    console.log(i * 10 - 10 , i * 10);
  }

  public showDialog(): void {
    this.showAddEmployeeDialog = true;
  }

}
