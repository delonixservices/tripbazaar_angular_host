import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services';

@Component({
	selector: 'app-otp-page',
	templateUrl: './otp.component.html',
	styleUrls: ['./otp.component.css']
})

export class OtpComponent implements OnInit {

	public otpObj: any;
	public validation: any;
	public token: any;

	constructor(private router: Router, public api: ApiService, private route: ActivatedRoute) {
		this.otpObj = {
			otp: '',
			userId: '',
		};
	}

	otpsubmit() {
		if (this.otpObj.otp == "") {
			this.validation = "Require fields are empty";
		} else {
			this.api.post("/auth/otp-verify", this.otpObj)
				.subscribe((response) => {
					if (response.status === 200) {
						this.router.navigate(['/account/login']);
					}
				}, (err) => {
					if (err.message !== undefined) {
						this.validation = err.message
					}
				})
		}
	}

	resentotp() {
		console.log('resend otp');
	}

	ngOnInit() {
		this.otpObj.userId = this.route.snapshot.paramMap.get('id');
	}
}
