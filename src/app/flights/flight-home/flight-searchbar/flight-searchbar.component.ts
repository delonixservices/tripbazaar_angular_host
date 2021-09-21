import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, AlertService } from '../../../core/services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-flight-searchbar',
  templateUrl: './flight-searchbar.component.html',
  styleUrls: ['./flight-searchbar.component.scss']
})

export class FlightSearchbarComponent implements OnInit {

  public departureAirport: string = "DEL";
  public arrivalAirport: string = "BOM";
  public departureDate: string;
  public returnDate: string;
  public flightSearchKeys: any;

  public tripCode = 1;

  public passengers: any = {};

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public api: ApiService,
    public alert: AlertService,
    public dateFormatter: NgbDateParserFormatter,
    public httpClient: HttpClient
  ) {
    this.passengers.adult_count = 1;
    this.passengers.child_count = 0;
    this.passengers.infant_count = 0;
  }

  ngOnInit() {
  }

  onChange(event) {
    console.log(event);
    this.passengers = event;
  }

  onDepartureDateSelect(date: NgbDateStruct) {
    this.departureDate = this.dateFormatter.format(date);
    console.log(this.departureDate);
  }

  onReturnDateSelect(date: NgbDateStruct) {
    this.returnDate = this.dateFormatter.format(date);
    console.log(this.returnDate);
  }

  searchFlights() {
    if (!this.departureAirport || !this.arrivalAirport || !this.departureDate) {
      this.alert.error("Required fields are empty");
      return;
    }

    this.flightSearchKeys = {
      'from': this.departureAirport,
      'to': this.arrivalAirport,
      'departureDate': this.departureDate,
      'returnDate': this.returnDate,
      'adult': this.passengers.adult_count,
      'child': this.passengers.child_count,
      'infant': this.passengers.infant_count
    }

    console.log(this.passengers)
    this.router.navigate(['flights', 'flight-search'], { queryParams: this.flightSearchKeys });
  }
}
