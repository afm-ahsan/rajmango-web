import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NotificationsRoutingModule,
  ],
  declarations: [
    NotificationListComponent,
  ],
})
export class NotificationsModule {}
