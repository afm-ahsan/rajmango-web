import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ErrorsRoutingModule } from './errors-routing.module';
import { ErrorsComponent } from '../errors/errors.component';
import { Error403Component } from './error403/error403.component';
import { Error404Component } from './error404/error404.component';
import { Error500Component } from './error500/error500.component';


@NgModule({
  declarations: [
    ErrorsComponent,
    Error403Component,
    Error404Component,
    Error500Component
  ],
  imports: [
    CommonModule,
    RouterModule,
    ErrorsRoutingModule
  ]
})
export class ErrorsModule { }
