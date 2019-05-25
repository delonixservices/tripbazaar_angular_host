import { Component, OnInit,  } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { Router, NavigationStart, ActivatedRoute} from '@angular/router';
import { ApiService, JwtService, AlertService } from '../core/services';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-hotelinvoice-page',
  templateUrl: './hotelinvoice.component.html',
  styleUrls: ['./hotelinvoice.component.css']
})

export class HotelinvoiceComponent implements OnInit {
	
  public transaction : any;
  public ticket =  [];
  
  constructor(private router: Router,  public api : ApiService, public domSanitizer : DomSanitizer,  private route: ActivatedRoute) {

  }
  
  
  getiframeUrl(long,lat){
  	var url = "https://maps.google.com/maps?&q="+lat+","+long+"&output=embed";
  	console.log(url)
  	return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
    
  	
  }
   
  ngOnInit() {
  	
     this.transaction = this.route.snapshot.paramMap.get('id');
     const params = new HttpParams()
     .set('transactionid',  this.transaction);
     this.api.get("/getmyticket",params)
			.subscribe((response) => {
					
			  	this.ticket = response;
				console.log("ticket....");	
			  	console.log(response);		  
			}, (err) => {
			})
  }
}
