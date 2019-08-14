import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService, JwtService } from '../core/services';

@Component({
	selector: 'app-login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	public paramsObj: any;
	public forgotObj: any;
	public validation: any;

	constructor(private router: Router, public api: ApiService, public jwt: JwtService) {

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
			this.api.post("/auth/login", this.paramsObj)
				.subscribe((response) => {
					if (response.status == 200) {
						this.jwt.saveToken(response.data.token, response.data.refreshToken);
						// TODO : check if account is verified 
						this.router.navigate(['/dashboard']);
					}
				}, (err) => {

					if (err.message !== undefined) {
						this.validation = err.message
					}
				})
		}


	}


	forgotRequest() {

		if (this.forgotObj.mobile == "") {
			this.validation = "Require fields are empty";
		} else {

			this.api.post("/auth/forgot", this.forgotObj)
				.subscribe((response) => {
					console.log(response.data);
					if (response.status == 200) {
						this.router.navigate(['/verifyotp/' + response.data._id]);
					}
				}, (err) => {
					if (err.message !== undefined) {
						this.validation = err.message
					}
				})
		}
	}


} //main
