import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ProfileServiceProxy, UserAddressServiceProxy } from 'src/app/services/client-proxy';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerProfileComponent } from './customer-profile.component';
import { CustomerProfileRoutingModule } from './customer-profile-routing.module';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { AddressModalComponent } from './address-modal/address-modal.component';

@NgModule({
  declarations: [
    CustomerProfileComponent,
    ProfilePageComponent,
    AddressModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    InlineSVGModule,
    SharedModule,
    CustomerProfileRoutingModule,
  ],
  providers: [ProfileServiceProxy, UserAddressServiceProxy],
})
export class CustomerProfileModule {}
