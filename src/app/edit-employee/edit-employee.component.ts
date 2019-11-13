import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { IEmployee } from '../types';

@Component({
  selector: 'custom-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent {

  constructor() {}

  public isVisible: boolean = true;
  @Output() editCancel = new EventEmitter();
  @Output() employeeEditSuccess = new EventEmitter<IEmployee>();
  public isApiCallInProgress: boolean = false;
  public currentEmployee: IEmployee | null = null;

  @Input('currentEmployee')
  set visibility(value: IEmployee | null) {
    if (value) {
      this.isVisible = true;
      this.employeeForm.reset();
      this.currentEmployee = value;
      Object.keys(this.employeeForm.controls)
        .forEach((key: string) => {
          if (this.currentEmployee[key]) {
            this.employeeForm.get(key).setValue(this.currentEmployee[key]);
          } else {
            this.employeeForm.get(key).setValue('');
          }
        });
      if (this.currentEmployee.dob) {
        this.employeeForm.get('dob').setValue(moment(this.currentEmployee.dob, 'DD/MM/YYYY').format('YYYY-MM-DD'));
        console.log(this.employeeForm.get('dob').value);
      }
    } else {
      this.isVisible = false;
    }
  }

  public employeeForm = new FormGroup({
    jobTitleName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required, Validators.email]),
  }, {
    updateOn: 'change',
  });

  public form(control: string): any {
    return this.employeeForm.get(control);
  }

  public editForm(): void {
    if (this.employeeForm.invalid) {
      Object.values(this.employeeForm.controls).forEach((control: FormControl) => control.markAsTouched());
      alert('Invalid form');
    } else {
      this.isApiCallInProgress = true;
      setTimeout(() => {
        this.isApiCallInProgress = false;
        this.employeeEditSuccess.emit({
          id: this.currentEmployee.id,
          ...this.employeeForm.value
        });
        alert('Employee Update Successfully');
        this.employeeForm.reset();
      }, 1500);
    }
  }

  public cancelEdit(): void {
    this.isVisible = false;
    this.editCancel.emit();
  }

  public isValid(name: string): boolean {
    return this.form(name).invalid && (this.form(name).dirty || this.form(name).touched);
  }

}
