// import { Injectable } from '@angular/core';
// import { ApiService } from './api.service';
// import { JwtService } from './jwt.service';

// @Injectable()

// export class AuthService {

//   isUserLoggedIn = false;
//   user : any;

//   constructor( private api: ApiService, private jwt: JwtService ) {
//   	if(jwt.getToken()){
//   		this.verify();
//   	}
//   }

//   async verify(){

//   await this.api.get("/auth/me")
// 		.subscribe(response => {
// 	  		if(response.status == 200){
// 	  			this.user = response.data;
// 	  			this.isUserLoggedIn = true;
// 	  		}
// 	  	},
// 	  	err => {
// 	  		this.isUserLoggedIn = false;
// 	  		this.user = "";
// 	  	});

//     return this.isUserLoggedIn;

//   }

// }


import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtService } from './jwt.service';
import { ApiService } from './api.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class AuthService implements CanActivate {

	public getLoggedInUser = new Subject();

	constructor(public api: ApiService, private jwt: JwtService, private router: Router) {

	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		const redirectUrl = route['_routerState']['url'];

		if (redirectUrl.search("/login") != -1 || redirectUrl.search("/register") != -1) {
			if (this.jwt.isAuth()) {

				this.router.navigateByUrl(
					this.router.createUrlTree(
						['/account/dashboard']
					)
				);
			}
			return true;

		} else {

			if (this.jwt.isAuth()) {
				return true;
			}

			this.router.navigateByUrl(
				this.router.createUrlTree(
					['/account/login']
				)
			);
			return false;
		}
	}

	login(paramsObj, callback) {
		this.api.post("/auth/login", paramsObj)
			.subscribe((response) => {
				console.log(response);
				if (response)
					this.jwt.saveToken(response.token, response.refreshToken);
				if (response.user.verified) {
					// this.jwt.saveToken(response.data.token, response.data.refreshToken);
					this.getLoggedInUser.next(response.user.name);
				}
				callback(response, false);
				// if (response && response.status == 200) {
				// 	console.log(response.data);
				// 	this.jwt.saveToken(response.data.token, response.data.refreshToken);
				// 	if (response.data.user.verified) {
				// 		// this.jwt.saveToken(response.data.token, response.data.refreshToken);
				// 		this.getLoggedInUser.next(response.data.user.name);
				// 	}
				// 	callback(response.data, false);
				// }
			}, (err) => {
				this.getLoggedInUser.next("");
				callback(null, err);
			});
	}

	logout(callback) {
		this.api.post("/auth/logout", { refreshToken: localStorage.jwtRefresh })
			.subscribe((response) => {
				console.log(response);
				this.getLoggedInUser.next("");
				this.jwt.destroyToken();
				callback(true);
			}, (err) => {
				// this.getLoggedInUser.next("");
				console.log(err);
				callback(false);
			});
	}

	resetPassword(resetObj, callback) {
		this.api.post("/auth/password-forgot", resetObj)
			.subscribe((response) => {
				console.log(response.data);
				if (response && response.status == 200) {
					callback({ success: true, data: response.data }, null);
				}
			}, (err) => {
				callback({ success: false, data: null }, err);
			});
	}
}
