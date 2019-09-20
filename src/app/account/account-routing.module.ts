import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';

import { AuthService } from '../core';

import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { OtpComponent } from './otp/otp.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyotpComponent } from './verifyotp/verifyotp.component';
import { VerifyuserComponent } from './verifyuser/verifyuser.component';

const routes: Routes = [{
    path: "", component: AccountComponent, children: [
        { path: "login", component: LoginComponent, canActivate: [AuthService] },
        { path: "register", component: RegisterComponent, canActivate: [AuthService] },
        { path: "profile", component: ProfileComponent, canActivate: [AuthService] },
        { path: "dashboard", component: DashboardComponent, canActivate: [AuthService] },
        { path: "otp/:id", component: OtpComponent },
        { path: "resetpassword/:id", component: ResetpasswordComponent },
        { path: "verifyotp/:id", component: VerifyotpComponent },
        { path: "verifyuser/:id", component: VerifyuserComponent },
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AccountRoutingModule { } 
