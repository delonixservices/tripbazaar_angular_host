import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import { ApiService, JwtService } from '../core/services';

@Component({
  selector: 'app-verifyotp-page',
  templateUrl: './verifyotp.component.html',
  styleUrls: ['./verifyotp.component.css']
})

export class VerifyotpComponent implements OnInit {
	
  public otpObj : any;
  public validation : any;
  
  constructor(private router: Router, public route : ActivatedRoute, public api : ApiService, public jwt : JwtService) {
  	
    	this.otpObj ={
    		otp: '',
    		id:''
    	}
  }
  
  	verifyOtp(){
		
		if(this.otpObj.otp  == "" ){
		    this.validation = "Require fields are empty";
		}else{
			
			this.api.get("/auth/reset", this.otpObj)
				.subscribe((response) => {
					console.log(response);
					if(response.status == 200){
						this.router.navigate(['/resetpassword/'+response.data._id]);
					}
				}, (err) => {
					if(err.message !== undefined){
						this.validation = err.message
				}
			})
		}
	}
    
  ngOnInit() {
     this.otpObj.id = this.route.snapshot.paramMap.get('id');
  }
}