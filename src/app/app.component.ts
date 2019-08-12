import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ApiService, JwtService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  public nav : any;
  public validation : any;
  
  constructor (public router : Router, public api : ApiService, public jwt : JwtService) {

	  this.router.events.subscribe(event => {
		  
		  if(event instanceof NavigationStart) {
			 if(event.url !== undefined){
		    	this.nav = event.url;
		     }
		  }
		  
		});
  
  }
  
   logout(){
   	
			this.api.post("/auth/logout", {refreshToken : localStorage.jwtRefresh})
				.subscribe((response) => {
					console.log(response);
					if(response.status == 200){
						
						this.jwt.destroyToken();
						this.router.navigate(['']);
					}
					
				}, (err) => {
					if(err.message !== undefined){
						this.validation = err.message
					}
			})

	}
	
	
  ngOnInit() {
  
  }
}
