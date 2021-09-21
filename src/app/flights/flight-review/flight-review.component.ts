import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FlightReviewService } from './flight-review.service';
import { NgbDateStruct, NgbDateParserFormatter, NgbDatepickerConfig, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, ApiService } from '../../core/services';
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

  transactionIdentifier: string;

  constructor (
    public flightReviewService: FlightReviewService,
    public dateFormatter: NgbDateParserFormatter,
    public datePickerConfig: NgbDatepickerConfig,
    public calander: NgbCalendar,
    public alert: AlertService,
    public api: ApiService,
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

      this.transactionIdentifier = response.transactionIdentifier;

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
    //   console.log(this.contactDetails);
    //   return;
    // }

    console.log('create order');
    this.flightReviewService.processOrder(this.flights, this.contactDetails, this.passengers, this.responseId, this.transactionIdentifier).subscribe((response: any) => {

      console.log(response);

      // const order = response['OrderViewRS'];
      // console.log(order && order.Response && response._id)
      // if (order && order.Response && response._id) {
      //   let url = this.api.baseUrl + "api/flights/process-payment/" + response._id;
      //   window.location.assign(url);
      // } else {
      //   const errMsg = "Unable to create order. No response from supplier."
      //   this.alert.error(errMsg);
      // }

      if (response.bookingId) {
        let url = this.api.baseUrl + "api/flights/process-payment/" + response.bookingId;
        window.location.assign(url);
      } else {
        const errMsg = "Unable to process order. No response from supplier."
        this.alert.error(errMsg);
      }

    }, (err) => {
      this.alert.error(err.message);
    });
  }
}
