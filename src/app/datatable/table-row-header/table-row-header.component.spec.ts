import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowHeaderComponent } from './table-row-header.component';

describe('TableRowHeaderComponent', () => {
  let component: TableRowHeaderComponent;
  let fixture: ComponentFixture<TableRowHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRowHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
