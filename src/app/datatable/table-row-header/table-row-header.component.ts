import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IEmployee, IHeaders } from 'src/app/types';

@Component({
  selector: 'custom-table-row-header',
  templateUrl: './table-row-header.component.html',
  styleUrls: ['./table-row-header.component.scss']
})
export class TableRowHeaderComponent {
  @Output() id = new EventEmitter();
  @Output() jobTitle = new EventEmitter();
  @Output() fullName = new EventEmitter();
  @Output() phoneNumber = new EventEmitter();
  @Output() email = new EventEmitter();
  @Output() region = new EventEmitter();
  @Output() dateOfBirth = new EventEmitter();

  public idSortFlag: number = 1;
  public jobSortingFlag: number = 1;
  public fullNameSortingFlag: number = 1;
  public phoneNumberSortingFlag: number = 1;
  public emailSortingFlag: number = 1;
  public regionSortingFlag: number = 1;
  public dateOFBirthSortingFlag: number = 1;

  public handleHeaderClick(id: keyof IHeaders): void {
    console.log('click', id);
    switch (id) {
      case 'id':
        this.idSortFlag *= -1;
        this.id.emit(this.idSortFlag);
        break;
      case 'job_title':
        this.jobSortingFlag *= -1;
        this.jobTitle.emit(this.jobSortingFlag);
        break;
      case 'full_name':
        this.fullNameSortingFlag *= -1;
        this.fullName.emit(this.fullNameSortingFlag);
        break;
      case 'phone_number':
        this.phoneNumberSortingFlag *= -1;
        this.phoneNumber.emit(this.phoneNumberSortingFlag);
        break;
      case 'email':
        this.emailSortingFlag *= -1;
        this.email.emit(this.emailSortingFlag);
        break;
      case 'region':
        this.regionSortingFlag *= -1;
        this.region.emit(this.regionSortingFlag);
        break;
      case 'dob':
        this.dateOFBirthSortingFlag *= -1;
        this.dateOfBirth.emit(this.dateOFBirthSortingFlag);
        break;
    }
  }

}
