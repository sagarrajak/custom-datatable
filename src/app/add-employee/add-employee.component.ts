import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'custom-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {

  public isVisible: boolean = true;
  @Output() modelClose = new EventEmitter();

  @Input('visible')
  set visibility(value: boolean) {
    this.isVisible = value;
  }

  public employeeForm = new FormGroup({
    id: new FormControl(''),
    jobTitleName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    preferredFullName: new FormControl(''),
    region: new FormControl(''),
    dob: new FormControl(''),
    phoneNumber: new FormControl(''),
    emailAddress: new FormControl(''),
  });

  public hide(): void {
    this.isVisible = false;
    this.modelClose.emit();
  }
}
