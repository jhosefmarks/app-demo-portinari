import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PoModule } from '@po-ui/ng-components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    PoModule
  ],
  exports: [
    CommonModule,
    FormsModule,

    PoModule
  ]
})
export class SharedModule { }
