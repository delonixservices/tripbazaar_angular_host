import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-login-page',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

	public paramsObj: any;
	public forgotObj: any;
	public loginValidation: any;
	public fgPassValidation: any;
	public modalRef: any;

	constructor(private router: Router,
		private auth: AuthService,
		private modalService: NgbModal
	) {
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
		this.loginValidation = "";
		if (this.paramsObj.mobile == "" || this.paramsObj.password == "") {
			this.loginValidation = "Require fields are empty";
		} else {
			this.auth.login(this.paramsObj, (data, err) => {
				console.log(data);
				if (err) {
					if (err.message !== undefined)
						this.loginValidation = err.message;
				} else if (!data.user.verified) {
					this.router.navigate(['/account/verifyuser', data.user._id]);
				} else {
					this.router.navigate(['/account/dashboard']);
				}
			});
		}
	}

	// Open forgot password modal
	open(fgPassModal) {
		this.modalRef = this.modalService.open(fgPassModal);
	}

	forgotRequest() {
		if (this.forgotObj.mobile == "") {
			this.fgPassValidation = "Require fields are empty";
		} else {
			console.log(this.forgotObj)
			this.auth.resetPassword(this.forgotObj, (res, err) => {
				if (res) {
					// close the modal
					this.modalRef.close();
					localStorage.setItem('password_reset', res.data.password_reset_token);
					this.router.navigate(['/account/verifyotp/' + res.data._id]);
				} else {
					if (err.message !== undefined)
						this.fgPassValidation = err.message;
				}
			});
		}
	}

} //main
