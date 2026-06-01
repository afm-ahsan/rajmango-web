import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TrackOrderRoutingModule } from './track-order-routing.module';
import { TrackOrderComponent } from './track-order.component';

@NgModule({
  declarations: [TrackOrderComponent],
  imports: [CommonModule, FormsModule, TrackOrderRoutingModule],
})
export class TrackOrderModule {}
