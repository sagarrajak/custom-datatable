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
        this.id.emit(this.idSortFlag);
        this.idSortFlag *= -1;
        break;
      case 'job_title':
        this.jobTitle.emit(this.jobSortingFlag);
        this.jobSortingFlag *= -1;
        break;
      case 'full_name':
        this.fullName.emit(this.fullNameSortingFlag);
        this.fullNameSortingFlag *= -1;
        break;
      case 'phone_number':
        this.phoneNumber.emit(this.phoneNumberSortingFlag);
        this.phoneNumberSortingFlag *= -1;
        break;
      case 'email':
        this.email.emit(this.emailSortingFlag);
        this.emailSortingFlag *= -1;
        break;
      case 'region':
        this.region.emit(this.regionSortingFlag);
        this.regionSortingFlag *= -1;
        break;
      case 'dob':
        this.dateOfBirth.emit(this.dateOFBirthSortingFlag);
        this.dateOFBirthSortingFlag *= -1;
        break;
    }
  }

}
