import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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
    console.log('employee');
    this.isVisible = value
    ;
  }

  public hide(): void {
    this.isVisible = false;
    this.modelClose.emit();
  }
}
