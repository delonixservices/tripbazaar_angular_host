import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { JwtService, ApiService, AuthService, AlertService, CacheService } from './core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HotelsModule } from './hotels/hotels.module';

import {
  FooterComponent,
  HeaderComponent,
} from './shared';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent
  ],

  imports: [
    HotelsModule,
    AppRoutingModule,
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgProgressModule,
    NgProgressHttpModule,
  ],

  providers: [
    JwtService,
    ApiService,
    AuthService,
    AlertService,
    CacheService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
