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


import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import { JwtService } from './jwt.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';

@Injectable()
export class AuthService implements CanActivate {

  constructor(private jwtService: JwtService, private router: Router) {
  	
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];
	
	if(redirectUrl.search("/login") != -1 || redirectUrl.search("/register") != -1){
		
		if (this.jwtService.isAuth()) {
			
	      	this.router.navigateByUrl(
		      this.router.createUrlTree(
		        ['/dashboard']
		      )
		    );
	    }
	    return true;
	    
	}else{
		
		if (this.jwtService.isAuth()) {
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
}
