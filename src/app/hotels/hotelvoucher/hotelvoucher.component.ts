import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApiService, JwtService, AlertService } from '../../core/services';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-hotelvoucher-page',
  templateUrl: './hotelvoucher.component.html',
  styleUrls: ['./hotelvoucher.component.css']
})

export class HotelvoucherComponent implements OnInit {

  public dataLocalUrl;
  public baseUrl;
  public transactionId;

  constructor(
    private router: Router, public api: ApiService, public domSanitizer: DomSanitizer, private route: ActivatedRoute, private http: HttpClient,
  ) {
    this.baseUrl = environment.api_url;
  }

  ngOnInit() {
    this.getVoucher();
  }

  // get voucher as pdf from server
  getVoucher() {
    this.route
      .queryParams
      .subscribe(params => {
        const httpParams = new HttpParams()
          .set('transactionid', params.id);
        this.transactionId = params.id;
        let headers = new HttpHeaders();
        headers = headers.set('Accept', 'application/pdf');
        this.http.get(`${this.baseUrl}/voucher`, { params: httpParams, headers: headers, responseType: 'blob', observe: 'response' })
          .subscribe((response) => {
            var blob = new Blob([response.body], { type: 'application/pdf' });
            this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
            // var filename = 'hotelVoucher.pdf';
            // saveAs(blob, filename);
          },
            error => {
              console.error(`Error: ${error.message}`);
            }
          );
      });
  }
}
