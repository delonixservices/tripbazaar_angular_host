import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApiService, JwtService } from '../../core/services';

@Component({
	selector: 'app-resetpassword-page',
	templateUrl: './resetpassword.component.html',
	styleUrls: ['./resetpassword.component.css']
})

export class ResetpasswordComponent implements OnInit {

	public resetObj: any;
	public validation: any;


	constructor(private router: Router, public route: ActivatedRoute, public api: ApiService, public jwt: JwtService) {

		this.resetObj = {
			id: '',
			password: '',
			newpassword: '',
			password_reset_token: ''
		};
	}

	resetPassword() {

		if (this.resetObj.password == "" || this.resetObj.newpassword == "") {
			this.validation = "Require fields are empty";
		}
		else if (this.resetObj.password !== this.resetObj.newpassword) {
			this.validation = "Password does not match";
		}
		else {
			this.api.post("/auth/password-reset", this.resetObj)
				.subscribe((response) => {
					if (response.status == 200) {
						this.validation = "";
						localStorage.removeItem('password_reset');
						this.router.navigate(['/account/login']);
					}
				}, (err) => {
					if (err.message !== undefined) {
						this.validation = err.message
					}
				})
		}
	}

	ngOnInit() {
		this.resetObj.userId = this.route.snapshot.paramMap.get('id');
		this.resetObj.password_reset_token = localStorage.getItem('password_reset');
	}
}
