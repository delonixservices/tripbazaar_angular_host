import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthService } from './core/services';


import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductComponent } from './product/product.component';
import { BusinessComponent } from './business/business.component';
import { FaqComponent } from './faq/faq.component';
import { Our_valuesComponent } from './our_values/our_values.component';
import { TicketComponent } from './ticket/ticket.component';
import { HotelinvoiceComponent } from './hotelinvoice/hotelinvoice.component';
import { Itinerary_detailsComponent } from './itinerary_details/itinerary_details.component';
import { HotelvoucherComponent } from './hotelvoucher/hotelvoucher.component';
import { FlightsearchComponent } from './flightsearch/flightsearch.component';
import { FlightbookingComponent } from './flightbooking/flightbooking.component';
import { HotelbookingComponent } from './hotelbooking/hotelbooking.component';
import { HoteldetailsComponent } from './hoteldetails/hoteldetails.component';
import { CareComponent } from './care/care.component';
import { TermComponent } from './term/term.component';
import { PolicyComponent } from './policy/policy.component';
import { RefundComponent } from './refund/refund.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ContactComponent } from './contact/contact.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchresultComponent } from './searchresult/searchresult.component';
import { ProfileComponent } from './profile/profile.component';
import { OtpComponent } from './otp/otp.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { SuccessComponent } from './success/success.component';


const routes: Routes = [
  { path : "", component : HomeComponent },
  { path : "about", component : AboutComponent },
  { path : "login", component : LoginComponent, canActivate: [AuthService]  },
  { path : "register", component : RegisterComponent, canActivate: [AuthService] },
  { path : "product", component : ProductComponent },
  { path : "business", component : BusinessComponent },
  { path : "faq", component : FaqComponent },
  { path : "our_values", component : Our_valuesComponent },
  { path : "ticket", component : TicketComponent },
  { path : "itinerary_details", component : Itinerary_detailsComponent },
  { path : "flightsearch", component : FlightsearchComponent },
  { path : "hotelvoucher", component : HotelvoucherComponent },
  { path : "hotelinvoice", component : HotelinvoiceComponent },
  { path : "hoteldetails", component : HoteldetailsComponent },
  { path : "hotelbooking", component : HotelbookingComponent },
  { path : "flightbooking", component : FlightbookingComponent },
  { path : "care", component : CareComponent },
  { path : "term", component : TermComponent },
  { path : "herm", component : HotelbookingComponent },
  { path : "searchresult", component : SearchresultComponent },
  { path : "policy", component : PolicyComponent },
  { path : "refund", component : RefundComponent },
  { path : "agreement", component : AgreementComponent },
  { path : "profile", component : ProfileComponent },
  { path : "contact", component : ContactComponent },
  { path : "dashboard", component : DashboardComponent, canActivate: [AuthService] },
  { path : "otp/:id", component : OtpComponent },
  { path : "resetpassword/:id", component : ResetpasswordComponent },
  { path : "verifyotp/:id", component : VerifyotpComponent },
  { path : "success", component : SuccessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
