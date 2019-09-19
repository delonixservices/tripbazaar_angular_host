import { Component, OnInit, Input, ViewChild, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, JwtService, AuthService, AlertService } from '../../core/services';

@Component({
	selector: 'app-layout-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

	@Input() nav: string;
	isLoggedIn: boolean;
	user = {
		name: ""
	}


	constructor(public route: ActivatedRoute,
		public router: Router,
		public api: ApiService,
		public jwt: JwtService,
		private authService: AuthService,
		public alertService: AlertService
	) {
	}

	ngOnInit() {
		if (this.jwt.isAuth()) {
			if (this.user.name === "") {
				this.getLoggedInUser();
			}
			else {
				this.isLoggedIn = false;
			}
		} else {
			this.isLoggedIn = false;
			console.log('Not auth');
		}

		this.authService.getLoggedInUser.subscribe(name => {
			if (name) {
				this.isLoggedIn = true;
				this.user.name = <string>name;
			} else {
				this.isLoggedIn = false;
				this.user.name = "";
			}
		});
	}

	logout() {
		this.authService.logout((success) => {
			this.router.navigate(['']);
		});
	}

	getLoggedInUser() {
		this.api.get("/auth/me")
			.subscribe((response) => {
				if (response.status == 200) {
					this.user.name = response.data.name;
					this.isLoggedIn = true;
				}
			}, (err) => {
				this.isLoggedIn = false;
				this.jwt.destroyToken();
				console.log('Jwt destroyed');
				console.log(`Unable to get logged in user: Error ${err.message}`);
			})
	}
}
