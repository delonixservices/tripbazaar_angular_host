import { ModuleWithProviders, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductComponent } from './product/product.component';
import { BusinessComponent } from './business/business.component';
import { SearchresultComponent } from './searchresult/searchresult.component';
import { FaqComponent } from './faq/faq.component';
import { Our_valuesComponent } from './our_values/our_values.component';
import { TicketComponent } from './ticket/ticket.component';
import { HotelinvoiceComponent } from './hotelinvoice/hotelinvoice.component';
import { Itinerary_detailsComponent } from './itinerary_details/itinerary_details.component';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { FlightbookingComponent } from './flightbooking/flightbooking.component';
import { HotelvoucherComponent } from './hotelvoucher/hotelvoucher.component';
import { HotelbookingComponent } from './hotelbooking/hotelbooking.component';
import { HoteldetailsComponent } from './hoteldetails/hoteldetails.component';
import { CareComponent } from './care/care.component';
import { TermComponent } from './term/term.component';
import { PolicyComponent } from './policy/policy.component';
import { RefundComponent } from './refund/refund.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { OtpComponent } from './otp/otp.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { SuccessComponent } from './success/success.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';

import {
  FooterComponent,
  HeaderComponent,
} from './shared';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { Ng5SliderModule } from 'ng5-slider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GalleryModule } from '@ngx-gallery/core';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    AboutComponent,
    LoginComponent,
    RegisterComponent,
    ProductComponent,
    BusinessComponent,
    FaqComponent,
    HoteldetailsComponent,
    HotelvoucherComponent,
    HotelbookingComponent,
    SearchresultComponent,
    CareComponent,
    Our_valuesComponent,
    TicketComponent,
    HotelinvoiceComponent,
    Itinerary_detailsComponent,
    FlightsearchComponent,
    FlightbookingComponent,
    TermComponent,
    PolicyComponent,
    RefundComponent,
    AgreementComponent,
    ContactComponent,
    DashboardComponent,
    ProfileComponent,
    OtpComponent,
    VerifyotpComponent,
    SuccessComponent,
    ResetpasswordComponent,
    VerifyuserComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    FormsModule,
    AppRoutingModule,
    NgSelectModule,
    NgProgressModule,
    NgProgressHttpModule,
    Ng5SliderModule,
    NgbModule,
    GalleryModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
