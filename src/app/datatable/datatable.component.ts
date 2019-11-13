import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmployee, IHeaders } from '../types';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { EmployeeService } from '../employee.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'custom-main-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private http: HttpClient,
    private employeeService: EmployeeService) {}

  private subscription: Subscription;
  public listEmployee: IEmployee[] = []; // table which is currenty vissible
  public backupListEmployee: IEmployee[] = []; // cached version of table for seaching
  public searchBackupEmployee: IEmployee[] = []; // a backup version for search
  public searchControl = new FormControl();

  public activePaginationIndex: number = 1;
  public paginationList: number[] = [];
  public paginationListSlice: number[] = [];

  public showAddEmployeeDialog: boolean = false;
  public currentEmployeeForEdit: IEmployee | null = null;

  ngOnInit() {
    this.subscription =
      this.http.get<IEmployee[][]>('https://my-json-server.typicode.com/darshanp40/employeedb/employees')
        .subscribe(res => {
          this.backupListEmployee = [...res[0]];
          // if (!environment.production) {
          //   for (let i = 0; i < 100000; i++) {
          //     this.backupListEmployee.push({
          //       id: Math.floor(Math.random() * 100000000) + '',
          //       jobTitleName: Math.random().toString(36).substring(7),
          //       firstName: Math.random().toString(36).substring(7),
          //       lastName: Math.random().toString(36).substring(7),
          //       preferredFullName: Math.random().toString(36).substring(7),
          //       employeeCode: Math.random().toString(36).substring(7),
          //       region: Math.random().toString(36).substring(2),
          //       dob: "11/2/2018",
          //       phoneNumber: Math.floor(Math.random() * 10000000000000) + ' ',
          //       emailAddress: Math.random().toString(36).substring(7) + '@gmail.com',
          //     });
          //   }
          // }
          this.searchBackupEmployee = [...this.backupListEmployee];
          this.employeeService.Employee = this.searchBackupEmployee;
          this.setPaginationFirstTime();
        }, err => {
          console.error(err);
        });
  }

  private setPaginationFirstTime(): void {
    this.paginationList = [];
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
    this.employeeService.Employee = this.searchBackupEmployee;
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
          if (String(query).trim()) {
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

  addNewEmployee(employee: IEmployee) {
    this.backupListEmployee.push(employee);
    this.searchBackupEmployee.push(employee);
    employee.dob = moment(employee.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
    this.setPaginationFirstTime();
  }

  deleteEmployee(id: string) {
    const indexMain = this.backupListEmployee.findIndex(employee => employee.id === id);
    const indexSearchBackup = this.searchBackupEmployee.findIndex(employee => employee.id === id);
    if (indexMain >= 0) {
      this.backupListEmployee.splice(indexMain, 1);
    }
    if (indexSearchBackup >= 0) {
      this.searchBackupEmployee.splice(indexSearchBackup);
    }
    this.setPaginationFirstTime();
  }

  editEmployee(employee: IEmployee) {
    this.currentEmployeeForEdit = employee;
  }

  editEmployeeSuccess(newEmployee: IEmployee) {
    const indexMain = this.backupListEmployee.findIndex(employee => employee.id === newEmployee.id);
    const indexSearchBackup = this.searchBackupEmployee.findIndex(employee => employee.id === newEmployee.id);
    if (indexMain >= 0) {
      this.backupListEmployee[indexMain] = {...newEmployee};
      this.backupListEmployee[indexMain].dob = moment(newEmployee.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }
    if (indexSearchBackup >= 0) {
       this.searchBackupEmployee[indexSearchBackup] = {...newEmployee};
       this.searchBackupEmployee[indexSearchBackup].dob = moment(newEmployee.dob, 'YYYY-MM-DD').format('DD/MM/YYYY');
    }
    this.currentEmployeeForEdit = null;
    this.setPaginationFirstTime();
  }
}
