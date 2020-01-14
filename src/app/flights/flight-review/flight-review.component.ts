import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FlightReviewService } from './flight-review.service';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../core/services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-review',
  templateUrl: './flight-review.component.html',
  styleUrls: ['./flight-review.component.scss']
})
export class FlightReviewComponent implements OnInit {

  @ViewChild('d1', { static: true }) datepicker: ElementRef;

  // public selectedFlight: any;
  public flights: Array<any> = [];
  public timeLimits: any;

  public allowProcessPayment: boolean;

  public contactDetails: any = {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    dob: ''
  };
  departureDate: any;
  contactDetailsValidation: string;
  oneWayFlight: any;
  returnFlight: any;
  responseId: any;
  fareDetails: any;
  passengers = [];

  passengersList;

  constructor(
    public flightReviewService: FlightReviewService,
    public dateFormatter: NgbDateParserFormatter,
    public datePickerConfig: NgbDatepickerConfig,
    public calander: NgbCalendar,
    public alert: AlertService,
    public router: Router,
    public route: ActivatedRoute,
  ) {
    datePickerConfig.minDate = { year: 1900, month: 1, day: 1 };
    // datePickerConfig.maxDate = calander.getToday()
  }

  ngOnInit() {
    const flights = JSON.parse(localStorage.getItem('selectedFlight'));

    this.flights[0] = flights.oneWayFlight;
    if (flights.returnFlight) {
      this.flights[1] = flights.returnFlight;
    }
    console.log(flights);

    this.passengersList = flights.passengers;

    this.passengersList.forEach((el) => {
      const passenger = {
        'id': el.PassengerID,
        'type': el.PTC,
        'name_title': 'Mr',
        'first_name': '',
        'middle_name': '',
        'last_name': '',
        'dob': ''
      }
      this.passengers.push(passenger);
    });
    console.log(this.passengers)

    this.oneWayFlight = flights.oneWayFlight;
    this.returnFlight = flights.returnFlight;

    if (this.oneWayFlight) {
      console.log(this.oneWayFlight)
    }

    this.route.queryParams.subscribe((response) => {
      this.responseId = response.responseId;

      // this.passengers.adult_count = response.ADT;
      // this.passengers.child_count = response.CHD;
      // this.passengers.infant_count = response.INF;

      if (!this.responseId) {
        // return this.router.navigate(['']);
      }
      this.getFlightPrice(this.passengersList);

    }, (err) => {
      console.log(err);
    });

  }

  getFlightPrice(passengersList) {

    this.flightReviewService.getPrice(this.oneWayFlight, this.returnFlight, passengersList, this.responseId).subscribe((response) => {
      let updatedFlights = response.flights;

      this.fareDetails = response.fareDetails;

      this.responseId = response.responseId;

      // updatedFlights.baggageAllowance = this.flight.baggageAllowance;
      this.flights = updatedFlights;

      this.passengersList = response.passengersList;

      this.timeLimits = response.timeLimits

      this.allowProcessPayment = true;

      console.log(updatedFlights);
    }, (err) => {
      this.alert.error(err);
    });
  }

  onDateSelect(date: NgbDateStruct, passengerId) {
    this.passengers.map((passenger) => {
      if (passenger.id === passengerId) {
        passenger.dob = this.dateFormatter.format(date);;
      }
    });
    // this.contactDetails.dob = this.dateFormatter.format(date);
    // console.log(this.departureDate);
    console.log(this.passengers)
  }

  createOrder() {

    // if (!this.contactDetails.firstName || !this.contactDetails.lastName || !this.contactDetails.phone || !this.contactDetails.email || !this.contactDetails.dob) {
    //   this.contactDetailsValidation = "Required fields are empty";
    //   return;
    // }
    console.log('create order');
    this.flightReviewService.createOrder(this.flights, this.contactDetails, this.passengers, this.responseId).subscribe((response) => {
      // console.log(response);

      localStorage.setItem('bookedOrder', JSON.stringify(response));

      const order = response['OrderViewRS'].Response.Order;

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
        }

        bookingKeys.push(bookingKeyObj);
      })

      const flightBookingKeys = JSON.stringify(bookingKeys);

      this.router.navigate(['/flights', 'flight-booking'], { queryParams: { 'flightBookingKeys': flightBookingKeys } });

      // this.orderRetrive();

    }, (err) => {
      this.alert.error(err);
    });
  }
}
