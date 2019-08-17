import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
	selector: 'app-login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	public paramsObj: any;
	public forgotObj: any;
	public validation: any;

	constructor(private router: Router, private auth: AuthService) {

		this.paramsObj = {
			mobile: '',
			password: ''
		};

		this.forgotObj = {
			mobile: ''
		};
	}
	ngOnInit() {
		//console.log(this.auth.verify(), this.auth.isUserLoggedIn);
	}

	login() {

		if (this.paramsObj.mobile == "" || this.paramsObj.password == "") {
			this.validation = "Require fields are empty";
		} else {

			this.auth.login(this.paramsObj, (isLoggedIn, err) => {
				if (isLoggedIn) {
					this.router.navigate(['/dashboard']);
				} else {
					if (err.message !== undefined) {
						this.validation = err.message
					}
				}
			});
		}
	}

	forgotRequest() {
		if (this.forgotObj.mobile == "") {
			this.validation = "Require fields are empty";
		} else {
			this.auth.resetPassword(this.forgotObj, (res, err) => {
				if (res.success) {
					this.router.navigate(['/verifyotp/' + res.data._id]);
				} else {
					if (err.message !== undefined) {
						this.validation = err.message
					}
				}
			});
		}
	}

} //main
