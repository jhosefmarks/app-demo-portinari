import { NgModule } from '@angular/core';

import { PoTemplatesModule, PoPageDynamicTableComponent, PoPageDynamicEditComponent, PoPageDynamicDetailComponent } from '@po-ui/ng-templates';

import { SharedModule } from './../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

import { environment } from 'src/environments/environment';

const routes: Routes = [
  { path: '', component: PoPageDynamicTableComponent, data: {
    serviceApi: environment.apiUrl + '/api/samples/v1/people'
  } },
  { path: 'new', component: PoPageDynamicEditComponent, data: {
    serviceApi: environment.apiUrl + '/api/samples/v1/people'
  } },
  { path: 'view/:id', component: PoPageDynamicDetailComponent, data: {
    serviceApi: environment.apiUrl + '/api/samples/v1/people'
  } },
  { path: 'edit/:id', component: PoPageDynamicEditComponent, data: {
    serviceApi: environment.apiUrl + '/api/samples/v1/people'
  } }
];

@NgModule({
  declarations: [ ],
  imports: [
    RouterModule.forChild(routes),

    PoTemplatesModule,

    SharedModule,

  ]
})
export class MetadataCustomersModule { }
