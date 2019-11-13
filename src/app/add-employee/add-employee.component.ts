import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { IEmployee } from '../types';
@Component({
  selector: 'custom-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {

  public isVisible: boolean = true;
  @Output() modelClose = new EventEmitter();
  @Output() employeeAddSuccess = new EventEmitter<IEmployee>();
  public isApiCallInProgress: boolean = false;

  @Input('visible')
  set visibility(value: boolean) {
    this.isVisible = value;
    this.employeeForm.reset();
  }

  public employeeForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    jobTitleName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    emailAddress: new FormControl('', [Validators.required]),
  });

  public form(control: string): any {
    return this.employeeForm.get(control);
  }

  public addForm(): void {
    if (this.employeeForm.invalid) {
      Object.values(this.employeeForm.controls).forEach((control: FormControl) => control.markAsTouched());
      alert('Invalid form');
    } else {
      this.isApiCallInProgress = true;
      setTimeout(() => {
        this.isApiCallInProgress = false;
        this.employeeAddSuccess.emit(this.employeeForm.value);
        alert('Added Successfully');
        this.employeeForm.reset();
        this.hide();
      }, 1500);
    }
  }

  public hide(): void {
    this.isVisible = false;
    this.modelClose.emit();
  }

  public isValid(name: string): boolean {
    return this.form(name).invalid && (this.form(name).dirty || this.form(name).touched);
  }

}
