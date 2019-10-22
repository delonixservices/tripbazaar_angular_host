import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApiService, JwtService, AlertService } from '../../core/services';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-hotelinvoice-page',
  templateUrl: './hotelinvoice.component.html',
  styleUrls: ['./hotelinvoice.component.css']
})

export class HotelinvoiceComponent implements OnInit {

  public transactionId: any;
  public ticket = [];
  public dataLocalUrl;
  public baseUrl;
  constructor(
    private router: Router,
    public api: ApiService,
    public alert: AlertService,
    public domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    this.baseUrl = environment.api_url;
  }

  ngOnInit() {
    // Commented Ankit
    // this.transactionId = this.route.snapshot.paramMap.get('id');
    // const params = new HttpParams()
    //   .set('transactionid', this.transaction);
    // this.api.get("/getmyticket", params)
    //   .subscribe((response) => {
    //     this.ticket = response;
    //     console.log("ticket....");
    //     console.log(response);
    //   }, (err) => {
    //     console.log(err);
    //   })

    this.getInvoice();
  }

  // get Invoice pdf from server
  getInvoice() {
    this.route
      .queryParams
      .subscribe(params => {
        const httpParams = new HttpParams()
          .set('transactionid', params.id);
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        this.http.get(`${this.baseUrl}/hotels/invoice`, { params: httpParams, headers: headers, responseType: 'blob', observe: 'response' })
          .subscribe((response) => {
            var blob = new Blob([response.body], { type: 'application/pdf' });
            this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
            // var filename = 'hotelInvoice.pdf';
            // saveAs(blob, filename);
          },
            error => {
              // this.alert.error(`Error: cannot get invoice for the selected transaction`);
              this.alert.error(`Error: You must be logged in to view the Invoice`);
              this.router.navigate(['/account', 'dashboard']);
            }
          );
      });
  }

  // parseDate(date: Date): string {
  //   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  //   let d = new Date(date);
  //   return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  // }

  // getiframeUrl(long, lat) {
  //   var url = "https://maps.google.com/maps?&q=" + lat + "," + long + "&output=embed";
  //   console.log(url)
  //   return this.domSanitizer.bypassSecurityTrustResourceUrl(url);

  // }

  // Add temp Rs 100 service change and 18% gst on service charge
  // getGrandTotal(ticket) {
  //   if (ticket[0] && ticket[0].hotelPackage) {
  //     if (ticket[0].hotelPackage.chargeable_rate) {
  //       return Math.ceil(ticket[0].hotelPackage.chargeable_rate +
  //         100 + (100 / 100 * 18));
  //     }
  //   }
  //   return 0;
  // }
}
