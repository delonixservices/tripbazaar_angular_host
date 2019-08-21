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
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
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
						['/dashboard']
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
					['/login']
				)
			);
			return false;
		}
	}

	login(paramsObj, callback) {
		this.api.post("/auth/login", paramsObj)
			.subscribe((response) => {
				if (response && response.status == 200) {
					this.jwt.saveToken(response.data.token, response.data.refreshToken);
					// TODO : check if account is verified
					this.getLoggedInUser.next(response.data.user.name);
					console.log(response.data);
					callback(response.data, false);
				}
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
				if (response.status == 200) {
					this.jwt.destroyToken();
					callback(true);
				} else {
					console.log(response.status);
				}
			}, (err) => {
				this.getLoggedInUser.next("");
				callback(false);
			});
	}

	resetPassword(resetObj, callback) {
		this.api.post("/auth/forgot", resetObj)
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
