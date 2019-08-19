import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService, JwtService } from './core/services';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

	public nav: any;
	public validation: any;

	constructor(public router: Router, public api: ApiService, public jwt: JwtService) {

		this.router.events.subscribe(event => {

			if (event instanceof NavigationStart) {
				if (event.url !== undefined) {
					this.nav = event.url;
				}
			}

		});

	}

	ngOnInit() {

	}
}
