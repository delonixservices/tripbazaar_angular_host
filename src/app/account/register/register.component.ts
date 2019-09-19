import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService, JwtService } from '../../core/services';

@Component({
	selector: 'app-register-page',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	public paramsObj: any;
	public validation: any;


	constructor(private router: Router, public api: ApiService) {
		this.paramsObj = {
			name: '',
			last_name: '',
			email: '',
			mobile: '',
			password: ''
		};
	}

	register() {

		if (this.paramsObj.name == "" || this.paramsObj.last_name == "" || this.paramsObj.email == "" || this.paramsObj.mobile == "" || this.paramsObj.password == "") {
			this.validation = "Require fields are empty";

		} else if (this.paramsObj.password.length < 8) {
			this.validation = "Password should be min 8 character.";
		} else {

			this.api.post("/auth/register", this.paramsObj)
				.subscribe((response) => {
					if (response.status == 201) {
						this.router.navigate(['/otp/' + response.data._id]);
					}
				}, (err) => {
					console.log(err)

					if (err.message !== undefined) {
						this.validation = err.message
					}
				})
		}


	}



	ngOnInit() {

	}
}
