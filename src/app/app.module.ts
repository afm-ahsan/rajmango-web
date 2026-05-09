import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appInitFactory } from './core/factories/app-init.factory';

import { FullCalendarModule } from '@fullcalendar/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ClipboardModule } from 'ngx-clipboard';

import { Router } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalHttpInterceptor } from './core/interceptors/global-http.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { AuthService } from './features/auth/services/auth.service';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
import { LoaderService } from './shared/services/loader.service';
import { SharedModule } from './shared/shared.module';
import { API_BASE_URL } from './services/client-proxy';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FullCalendarModule,
    NgbModule,
    TranslateModule.forRoot(),
    InlineSVGModule.forRoot(),
    ClipboardModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [AuthService, LoaderService, Router],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalHttpInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
    {
      provide: API_BASE_URL,
      useValue: environment.apis.default.url
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
