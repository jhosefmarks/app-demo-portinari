import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../shared/shared.module';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';

@NgModule({
  declarations: [
    CustomerFormComponent,
    CustomerListComponent,
    CustomerViewComponent
  ],
  imports: [
    CommonModule,

    SharedModule,

    CustomersRoutingModule
  ]
})
export class CustomersModule { }
