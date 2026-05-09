import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WidgetsModule } from 'src/app/_metronic/partials';
import { HomeComponent } from './home.component';
import { NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MangoDetailModalComponent } from 'src/app/shared/components/mango-detail-modal/mango-detail-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [HomeComponent, MangoDetailModalComponent],
  imports: [
    CommonModule,
    NgbModule,
    NgbModalModule,
    RouterModule.forChild([
        {
            path: '',
            component: HomeComponent,
        },
    ]),
    WidgetsModule,
    SharedModule
]
})
export class HomeModule { }
