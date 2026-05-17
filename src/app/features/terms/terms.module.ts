import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsRoutingModule } from './terms-routing.module';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [CommonModule, TermsRoutingModule],
})
export class TermsModule {}
