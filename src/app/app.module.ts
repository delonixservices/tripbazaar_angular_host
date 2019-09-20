import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import {
  FooterComponent,
  HeaderComponent,
} from './shared';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AccountModule } from './account/account.module'
import { AboutModule } from './about/about.module'
import { HotelsModule } from './hotels/hotels.module';
import { FlightsModule } from './flights/flights.module';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent
  ],

  imports: [
    AppRoutingModule,
    CoreModule,
    AccountModule,
    AboutModule,
    HotelsModule,
    FlightsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgProgressModule,
    NgProgressHttpModule,
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
