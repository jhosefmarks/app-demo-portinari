import { NgModule } from '@angular/core';

import { PoTemplatesModule, PoPageDynamicTableComponent, PoPageDynamicEditComponent, PoPageDynamicDetailComponent } from '@portinari/portinari-templates';

import { SharedModule } from './../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PoPageDynamicTableComponent, data: {
    serviceApi: 'http://localhost:5000/api/samples/v1/people'
  } },
  { path: 'new', component: PoPageDynamicEditComponent, data: {
    serviceApi: 'http://localhost:5000/api/samples/v1/people'
  } },
  { path: 'view/:id', component: PoPageDynamicDetailComponent, data: {
    serviceApi: 'http://localhost:5000/api/samples/v1/people'
  } },
  { path: 'edit/:id', component: PoPageDynamicEditComponent, data: {
    serviceApi: 'http://localhost:5000/api/samples/v1/people'
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
