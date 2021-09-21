import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  public loginUser: any;
  public transactions: any;
  public flightTransactions: any;
  public parsedTransactions: any;

  public activeId: number = 1;

  constructor (
    private router: Router,
    public api: ApiService,
  ) {

  }

  ngOnInit() {

    this.api.get("/auth/me")
      .subscribe((response) => {
        if (response) {
          this.loginUser = response;
          this.getHotelTransaction();
          this.getFlightTransactions();
        }
        // if (response.status === 200) {
        // 	this.loginUser = response.data;
        // 	this.getMyTransaction();
        // } else {
        // 	this.router.navigate(['/account/login']);
        // }

      }, (err) => {
        this.router.navigate(['/account/login']);
      })
  }

  activeIdChange(event) {
    console.log(event);

  }

  getHotelTransaction() {
    this.api.post("/hotels/transactions", { "user": this.loginUser })
      .subscribe((response) => {
        this.transactions = response.data;
        console.log(this.transactions);
      }, (err) => {
        console.log(err);
      })
  }

  getFlightTransactions() {
    console.log('Flight transactions...');
    this.api.post("/flights/transactions", { "userId": this.loginUser._id })
      .subscribe((response) => {
        this.flightTransactions = response.data;
        console.log(this.flightTransactions);

        const parsedTransactions = [];

        const transactions = this.flightTransactions.filter((el) => {
          if (!el.order_create_response) {
            return false;
          }
          return true;
        });

        console.log(transactions);

        transactions.forEach((trans) => {
          const dataLists = trans.order_create_response.Response.DataLists;
          const originDest = dataLists.OriginDestinationList.OriginDestination;

          let tripDetails;
          if (Array.isArray(originDest)) {
            tripDetails = `${originDest[0].DepartureCode}-${originDest[0].ArrivalCode}`;
          } else {
            tripDetails = `${originDest.DepartureCode}-${originDest.ArrivalCode}`;
          }

          const flightSegmentRef = trans.order_create_response.Response.DataLists.FlightSegmentList.FlightSegment;
          let flightSegment;
          if (Array.isArray(flightSegmentRef)) {
            flightSegment = flightSegmentRef[0];
          } else {
            flightSegment = flightSegmentRef;
          }

          const journeyDate = `${flightSegment.Departure.Date} ${flightSegment.Departure.Time}`;

          let airline;
          if (flightSegment.MarketingCarrier) {
            airline = `${flightSegment.MarketingCarrier.AirlineID}-${flightSegment.MarketingCarrier.FlightNumber}`;
          } else {
            airline = `${flightSegment.OperatingCarrier.AirlineID}-${flightSegment.OperatingCarrier.FlightNumber}`;
          }

          const travellers = dataLists.PassengerList.Passenger.length | 1;

          const getStatus = ["failed", "success", "cancelled", "payment_pending", "payment_success", "booking_failed", "payment_failed", "refunded", "booking_hold"];

          const newTrans = {
            'bookingRefNo': trans._id,
            'tripDetails': tripDetails,
            'journeyDate': journeyDate,
            'airline': airline,
            'travellers': travellers,
            'status': getStatus[trans.status]
          }

          parsedTransactions.push(newTrans);
        });

        this.parsedTransactions = parsedTransactions;
        console.log(parsedTransactions);
      }, (err) => {
        console.log(err);
      })
  }

  processPaymentClickHandler(transactionId) {
    let url = this.api.baseUrl + "api/flights/process-payment/" + transactionId;
    window.location.assign(url);
  }

  bookingDetailsClickHandler(transactionId) {

    const transaction = this.flightTransactions.filter((el) => el._id === transactionId)[0];

    if (!transaction) {
      return;
    }

    const order = transaction.order_create_response.Response.Order;

    let orders = [];

    if (!Array.isArray(order)) {
      orders[0] = order;
    } else {
      orders = order;
    }

    let bookingKeys = [];

    orders.forEach((order) => {
      const orderId = order.OrderID;
      const owner = order.Owner;
      const bookingRefId = order.BookingReferences.BookingReference[0].ID;
      const otherId = order.BookingReferences.BookingReference[0].OtherID;
      const airlineName = order.BookingReferences.BookingReference[1].AirlineID.Name;
      const airlineCode = order.BookingReferences.BookingReference[1].AirlineID.content;

      const bookingKeyObj = {
        'bookingRefId': bookingRefId,
        'otherId': otherId,
        'airlineName': airlineName,
        'airlineCode': airlineCode,
        'orderId': orderId,
        'owner': owner,
        'bookingId': transactionId
      }

      bookingKeys.push(bookingKeyObj);
    })

    const flightBookingKeys = JSON.stringify(bookingKeys);

    this.router.navigate(['/flights', 'flight-booking'], { queryParams: { 'flightBookingKeys': flightBookingKeys } });
  }

  viewDetailsClickHandler(transaction) {
    localStorage.setItem('manage_booking', JSON.stringify(transaction));
    this.router.navigate(['account/manage-booking']);
  }

  // cancelHotelBooking(transactionid) {

  //   Swal({
  //     title: 'Are you sure?',
  //     text: 'Your hotel will be cancelled after this request',
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, cancel it!',
  //     cancelButtonText: 'Do not cancel'
  //   }).then((result) => {
  //     if (result.value) {
  //       this.api.post("/hotels/cancel", { "user": this.loginUser, 'transactionId': transactionid })
  //         .subscribe((response) => {
  //           console.log(response)
  //           if (response && response.data) {
  //             this.transactions.forEach((transaction) => {
  //               if (transaction._id === transactionid) {
  //                 transaction.status = 2;
  //               }
  //             })
  //             Swal({
  //               title: 'Hotel Cancelled!',
  //               text: 'Your hotel has been cancelled successfully',
  //               type: 'success'
  //             })
  //             console.log(response);
  //           }

  //         }, (err) => {
  //           Swal({
  //             title: 'Hotel Cancellation Failed!',
  //             text: "Hotel cannot be cancelled! Please try again.",
  //             type: 'error'
  //           })
  //         })
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       // handle dismiss
  //     }
  //   })
  // }

  hotelInvoice(id) {
    this.router.navigate(['/hotels/hotelinvoice'], { queryParams: { id: id } });
  }

  hotelVoucher(id) {
    this.router.navigate(['/hotels/hotelvoucher'], { queryParams: { id: id } });
  }

  // isCancelAllowed(date) {
  //   const checkInDate = new Date(date).getTime();
  //   return checkInDate > Date.now();
  // }
}
