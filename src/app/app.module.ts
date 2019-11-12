import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DatatableComponent } from './datatable/datatable.component';
import { TableRowComponent } from './datatable/table-row/table-row.component';
import { TableRowHeaderComponent } from './datatable/table-row-header/table-row-header.component';

@NgModule({
  declarations: [
    AppComponent,
    DatatableComponent,
    TableRowComponent,
    TableRowHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
