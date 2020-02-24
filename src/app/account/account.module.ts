import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { OtpComponent } from './otp/otp.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AccountRoutingModule } from "./account-routing.module";
import { ManageBookingsComponent } from './manage-bookings/manage-bookings.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageFlightBookingsComponent } from './manage-flight-bookings/manage-flight-bookings.component';

@NgModule({
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    OtpComponent,
    VerifyotpComponent,
    ResetpasswordComponent,
    VerifyuserComponent,
    DashboardComponent,
    ManageBookingsComponent,
    ManageFlightBookingsComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    FormsModule,
    NgbNavModule,
  ]
})

export class AccountModule { }