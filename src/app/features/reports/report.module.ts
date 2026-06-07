import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';
import { ReportPageComponent } from './report-page/report-page.component';

@NgModule({
  declarations: [
    ReportComponent,
    ReportPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InlineSVGModule,
    SharedModule,
    ReportRoutingModule,
  ],
  providers: [],
})
export class ReportModule {}
