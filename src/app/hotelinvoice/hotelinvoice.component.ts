import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { ApiService, JwtService, AlertService } from '../core/services';
import { HttpParams } from '@angular/common/http';

declare let jsPDF;

@Component({
  selector: 'app-hotelinvoice-page',
  templateUrl: './hotelinvoice.component.html',
  styleUrls: ['./hotelinvoice.component.css']
})

export class HotelinvoiceComponent implements OnInit {

  public transactionId: any;
  public ticket = [];

  constructor(private router: Router, public api: ApiService, public domSanitizer: DomSanitizer, private route: ActivatedRoute) {
  }

  ngOnInit() {

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


    // change Ankit
    this.route
      .queryParams
      .subscribe(params => {
        const httpParams = new HttpParams()
          .set('transactionid', params.id);
        this.transactionId = params.id;
        this.api.get("/getmyticket", httpParams)
          .subscribe((response) => {
            this.ticket = response;
            console.log(response);
          }, (err) => {
            console.log(err);
          })
      });
  }

  saveInvoice() {
    console.log(this.ticket)
    var pdf = new jsPDF();

    // doc.fromHTML(this.html.nativeElement.innerHTML, 20, 20, {
    //   width: 180,
    //   elementHandlers: { '#editor': (element, renderer) => true }
    // });
    console.log(pdf.getFontList());
    pdf.setFont("Helvetica");
    pdf.setFontType("bold");

    // header
    pdf.text(85, 15, 'TAX INVOICE');

    pdf.setFontSize(30);
    pdf.setTextColor(222, 60, 49);
    pdf.text(20, 30, 'Tripbazaar.co');

    // hotel details
    pdf.setFontSize(12);
    pdf.setTextColor(28, 99, 186);
    pdf.text(20, 50, "Hotel name");
    pdf.text(20, 60, "Guest Name");
    pdf.text(20, 70, "Guest Email");
    pdf.text(20, 80, "Guest Phone");

    pdf.setTextColor(0, 0, 0);
    pdf.setFontType("normal");

    pdf.text(50, 50, this.ticket[0].hotel.originalName);
    pdf.text(50, 60, `${this.ticket[0].book_response.data.guest.first_name}  ${this.ticket[0].book_response.data.guest.last_name}`);
    pdf.text(50, 70, this.ticket[0].book_response.data.guest.email);
    pdf.text(50, 80, this.ticket[0].book_response.data.guest.contact_no.toString());

    // booking details
    pdf.setFontType("bold");
    pdf.setFontSize(11);
    pdf.text(100, 50, 'Booking ID:');
    // pdf.text(100, 40, 'Invoice No:');

    pdf.setFontType("normal");
    pdf.text(125, 50, this.ticket[0].book_response.data.booking_id);
    // pdf.text(135, 40, this.ticket[0].book_response.data.booking_id);

    pdf.setFontType("bold");
    pdf.text(100, 60, "Date of Booking:");
    pdf.text(100, 70, "Date of Invoice:");
    pdf.setFontType("normal");
    pdf.text(137, 60, `${this.parseDate(this.ticket[0].book_response.data.confirmed_at)}`);
    pdf.text(135, 70, this.parseDate(this.ticket[0].created_at));

    pdf.setFontSize(12);
    pdf.setFontType("bold");
    // pdf.text(20, 90, "Description of Service:");
    pdf.text(20, 100, "Place of Supply:");
    pdf.text(20, 110, "CHECK-IN:");
    pdf.text(80, 110, "CHECK-OUT:");
    pdf.text(20, 120, "No.of Rooms:");
    // pdf.text(50, 120, "No.of Nights:");
    pdf.text(20, 130, "Room Type:");


    // Parse checkIn and checkOut date
    const checkInDate = this.parseDate(this.ticket[0].book_response.data.package.check_in_date);
    const checkOutDate = this.parseDate(this.ticket[0].book_response.data.package.check_out_date);

    pdf.setFontType("normal");
    pdf.text(58, 100, this.ticket[0].hotel.location.city);
    pdf.text(48, 110, checkInDate);
    pdf.text(113, 110, checkOutDate);
    pdf.text(52, 120, `${this.ticket[0].book_response.data.package.room_count}`);
    //for no of nights
    // pdf.text(78, 120, `1`);
    pdf.text(50, 130, this.ticket[0].book_response.data.package.room_details.description);

    // insert pricing table into the pdf
    pdf.autoTable({
      html: '#price-table',
      startY: 160,
      styles: {
        fontSize: 14,
        cellWidth: 'wrap'
      },
      willDrawCell: function (data) {
        if (data.row.index === 0) {
          pdf.setFontType('bold');
          pdf.setTextColor(255, 255, 255);
          pdf.setFillColor(24, 117, 210);
        }
      },
      columnStyles: {
        1: { cellWidth: 'auto' }
      }
    });

    pdf.save('invoice.pdf');
  }

  parseDate(date: Date): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let d = new Date(date);
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  }

  getiframeUrl(long, lat) {
    var url = "https://maps.google.com/maps?&q=" + lat + "," + long + "&output=embed";
    console.log(url)
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);

  }

  getGrandTotal(ticket) {
    if (ticket[0] && ticket[0].hotelPackage) {
      if (ticket[0].hotelPackage.chargeable_rate) {
        return Math.ceil(ticket[0].hotelPackage.chargeable_rate +
          (ticket[0].hotelPackage.chargeable_rate / 100 * 2) +
          ((ticket[0].hotelPackage.chargeable_rate / 100 * 2) / 100 * 18));
      }
    }
    return 0;
  }
}
