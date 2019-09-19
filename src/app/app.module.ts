import { ModuleWithProviders, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductComponent } from './product/product.component';
import { BusinessComponent } from './business/business.component';
import { FaqComponent } from './faq/faq.component';
import { Our_valuesComponent } from './our_values/our_values.component';
import { TicketComponent } from './ticket/ticket.component';
import { Itinerary_detailsComponent } from './itinerary_details/itinerary_details.component';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { FlightbookingComponent } from './flightbooking/flightbooking.component';
import { CareComponent } from './care/care.component';
import { TermComponent } from './term/term.component';
import { PolicyComponent } from './policy/policy.component';
import { RefundComponent } from './refund/refund.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';
import { SuccessComponent } from './success/success.component';

import {
  FooterComponent,
  HeaderComponent,
} from './shared';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AccountModule } from './account/account.module'
import { HotelsModule } from './hotels/hotels.module';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FlightsComponent } from './flights/flights.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    ProductComponent,
    BusinessComponent,
    FaqComponent,
    CareComponent,
    Our_valuesComponent,
    TicketComponent,
    Itinerary_detailsComponent,
    FlightsearchComponent,
    FlightbookingComponent,
    TermComponent,
    PolicyComponent,
    RefundComponent,
    AgreementComponent,
    ContactComponent,
    SuccessComponent,
    FlightsComponent,
  ],

  imports: [
    AppRoutingModule,
    CoreModule,
    AccountModule,
    HotelsModule,
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
