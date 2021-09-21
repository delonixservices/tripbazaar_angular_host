import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ApiService } from '../../core';
// import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-flight-bookings',
  templateUrl: './manage-flight-bookings.component.html',
  styleUrls: ['./manage-flight-bookings.component.css']
})

export class ManageFlightBookingsComponent implements OnInit {

  constructor (
    public router: Router,
    public route: ActivatedRoute,
    public alert: AlertService,
    public api: ApiService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((response) => {
      console.log(response);
      if (response.id) {
        this.getTransaction(response.id);
      } else {
        this.alert.error("Flight booking failed due to some technical error. Please try again.");
      }
    }, (err) => {
      console.log(err);
      this.alert.error(err.message);
    });
  }

  getTransaction(transactionId) {
    this.api.get(`/flights/transaction/${transactionId}`).subscribe((response) => {
      console.log(response);
      if (response.status === 1) {
        // this.router.navigate(['flights', 'flight-booking'])
        const transaction = response;
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
      } else {
        this.router.navigate(['/account', 'dashboard']);
      }
    }, (err) => {
      if (err.message) {
        this.alert.error(err.message);
      } else {
        this.alert.error('Unable to fetch transaction status. Please try again!')
      }
    });
  }
}
