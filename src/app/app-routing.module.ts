import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule) },
  { path: 'dynamic-customers', loadChildren: () => import('./dynamic-customers/dynamic-customers.module').then(m => m.DynamicCustomersModule) },
  { path: 'template-customers', loadChildren: () => import('./template-customers/template-customers.module').then(m => m.TemplateCustomersModule) },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
