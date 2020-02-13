import { NgModule } from '@angular/core';

import { PoTemplatesModule } from '@portinari/portinari-templates';

import { SharedModule } from './../shared/shared.module';

import { TemplateCustomersRoutingModule } from './template-customers-routing.module';
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
    PoTemplatesModule,

    SharedModule,

    TemplateCustomersRoutingModule,
  ]
})
export class TemplateCustomersModule { }
