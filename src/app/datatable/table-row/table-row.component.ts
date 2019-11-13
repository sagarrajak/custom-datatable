import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEmployee } from 'src/app/types';

@Component({
  selector: 'custom-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent {

  @Input('employee') employee: IEmployee;
  @Output('edit') edit = new EventEmitter<IEmployee>();
  @Output('delete') delete = new EventEmitter<string>();

  public onDelete(id: string) {
    const con = confirm('Are you sure you want to delete employee?');
    if (con === true) {
      this.delete.emit(id);
    }
  }

  public onEdit(employee: IEmployee) {
    this.edit.emit(employee);
  }

}
