import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { OtpComponent } from './otp/otp.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AppRoutingModule } from "../app-routing.module";

@NgModule({
    declarations: [
        LoginComponent,
        RegisterComponent,
        ProfileComponent,
        OtpComponent,
        VerifyotpComponent,
        ResetpasswordComponent,
        VerifyuserComponent,
        DashboardComponent
    ],
    imports: [
        CommonModule,
        AppRoutingModule,
        FormsModule,
    ]
})

export class AccountModule { }