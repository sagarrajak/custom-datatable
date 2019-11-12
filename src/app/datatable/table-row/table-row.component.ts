import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IEmployee } from 'src/app/types';

@Component({
  selector: 'custom-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.scss']
})
export class TableRowComponent implements OnInit {

  constructor() { }
  @Input('employee') employee: IEmployee;
  @Output('edit') edit = new EventEmitter();
  @Output('view') view = new EventEmitter();
  @Output('delete') delete = new EventEmitter();
  ngOnInit() {
  }

}
