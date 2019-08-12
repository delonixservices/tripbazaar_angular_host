import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import { ApiService, JwtService } from '../core/services';

@Component({
  selector: 'app-resetpassword-page',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})

export class ResetpasswordComponent implements OnInit {
	
  public resetObj : any;	
  public validation : any;	
  	
  
  constructor(private router: Router, public route : ActivatedRoute, public api : ApiService, public jwt : JwtService) {
  	
  		this.resetObj = {
			id:'',
			password :'',
			newpassword:''
			
		};
  }
  
   resetPassword(){
		 
			if(this.resetObj.password  == "" || this.resetObj.newpassword  == "" ){
			    this.validation = "Require fields are empty";
			}else{
				this.api.post("/auth/reset", this.resetObj)
				.subscribe((response) => {
					if(response.status == 200){
						this.router.navigate(['/login']);
					}
				}, (err) => {
					if(err.message !== undefined){
						this.validation = err.message
					}
				})
			}
		
			
	}
	
	
  ngOnInit() {
     this.resetObj.id = this.route.snapshot.paramMap.get('id');
  }
}
