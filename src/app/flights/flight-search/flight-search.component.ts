import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../core/services';
import { FlightSearchService } from './flight-search.service';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})

export class FlightSearchComponent implements OnInit, OnDestroy {

  oneWayFlights: Array<any> = [];
  returnFlights: Array<any> = [];
  isTwoWayJourney: boolean = false;

  departureAirport: any;
  arrivalAirport: any;
  departureDate: any;
  returnDate: any;

  public passengers = {
    adult_count: 1,
    child_count: 0,
    infant_count: 0
  };

  flightSearchKeys: any;

  selectedOneWayFlight: any;
  selectedReturnFlight: any;

  private ngUnsubscribe = new Subject();
  responseId: any;
  passengersList: any;

  constructor (
    public router: Router,
    public route: ActivatedRoute,
    public alert: AlertService,
    public flightSearchService: FlightSearchService
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe((response) => {
      this.flightSearchKeys = response;
      this.departureAirport = response.from;
      this.arrivalAirport = response.to;
      this.departureDate = response.departureDate;
      this.returnDate = response.returnDate;
      this.passengers.adult_count = response.adult;
      this.passengers.child_count = response.child;
      this.passengers.infant_count = response.infant;

      if (this.returnDate) {
        this.isTwoWayJourney = true;
      }

      console.log(response);
      this.searchResults();

    }, err => {
      console.log(err);
    });
  }

  searchResults() {

    if (!this.departureAirport || !this.arrivalAirport || !this.departureDate || this.passengers.adult_count < 1 || this.passengers.child_count < 0 || this.passengers.infant_count < 0) {
      this.alert.error("Required fields are invalid");
      return;
    }

    if (this.returnDate) {
      this.isTwoWayJourney = true;
    }

    this.flightSearchService.getFlights(this.departureAirport, this.arrivalAirport, this.departureDate, this.returnDate, this.passengers)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response) => {
        console.log(response);
        this.oneWayFlights = response.oneWayFlights;
        this.returnFlights = response.returnFlights;
        this.selectedOneWayFlight = this.oneWayFlights[0];
        this.selectedReturnFlight = this.returnFlights[0];
        this.passengersList = response.passengers;
        this.responseId = response.responseId;
      }, err => {
        console.log(err);
        this.alert.error(err);
      });
  }

  onOneWayFlightSelect(flight) {
    console.log(flight);
    this.selectedOneWayFlight = flight;
  }

  onReturnFlightSelect(flight) {
    console.log(flight);
    this.selectedReturnFlight = flight;
  }

  bookSelectedPackage() {
    const selectedFlight = {
      'oneWayFlight': this.selectedOneWayFlight,
      'returnFlight': this.selectedReturnFlight,
      'passengers': this.passengersList
    };

    localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));

    const queryParams = {
      'responseId': this.responseId,
      'ADT': this.passengers.adult_count,
      'CHD': this.passengers.child_count,
      'INF': this.passengers.infant_count
    }
    console.log(queryParams);
    this.router.navigate(['/flights', 'flight-review'], { queryParams: queryParams });
  }

  onBookFlight(flight) {
    const selectedFlight = {
      'oneWayFlight': flight,
      'passengers': this.passengersList
    };
    localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
    const queryParams = {
      'responseId': this.responseId,
      'ADT': this.passengers.adult_count,
      'CHD': this.passengers.child_count,
      'INF': this.passengers.infant_count
    }
    console.log(queryParams);

    this.router.navigate(['/flights', 'flight-review'], { queryParams: queryParams });
  }

  ngOnDestroy() {
    this.flightSearchService.handleUnsubscribe();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
