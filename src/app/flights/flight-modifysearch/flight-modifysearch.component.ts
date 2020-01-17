import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService, AlertService } from '../../core/services';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flight-modifysearch',
  templateUrl: './flight-modifysearch.component.html',
  styleUrls: ['./flight-modifysearch.component.scss']
})
export class FlightModifysearchComponent implements OnInit {

  @Input() departureAirport: string;
  @Input() arrivalAirport: string;
  @Input() departureDate: string;
  @Input() returnDate: string;

  @Input() passengers: any;

  @Input() twoWayJourney: boolean;

  public depDate: NgbDateStruct;

  public flightSearchKeys: any;

  public tripCode = 1; // 1 = oneWay, 2 = twoWay, 3 = multicity

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public api: ApiService,
    public alert: AlertService,
    public dateFormatter: NgbDateParserFormatter
  ) {
    // router will again navigate to the page for same route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.passengers.adult_count = params.adult;
      this.passengers.child_count = params.child;
      this.passengers.infant_count = params.infant;
    });

    const date = new Date(this.departureDate);
    this.depDate = this.dateFormatter.parse(this.departureDate);

    console.log(this.departureDate);

    this.tripCode = this.twoWayJourney ? 2 : 1;

    // this.depDate = {
    //   day: date.getDay(),
    //   month: date.getMonth() + 1,
    //   year: date.getFullYear()
    // }

    console.log(this.depDate)
  }

  onDepartureDateSelect(date: NgbDateStruct) {
    this.departureDate = this.dateFormatter.format(date);
    console.log(this.departureDate);
  }

  onReturnDateSelect(date: NgbDateStruct) {
    this.returnDate = this.dateFormatter.format(date);
    console.log(this.returnDate);
  }

  onChange(event) {
    console.log(event);
    this.passengers = event;
  }

  searchAgain() {
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
    // will always reload the flight-search component, whether we are the same route or not 
    this.router.navigated = false;
    this.router.navigate(['flights', 'flight-search'], { queryParams: this.flightSearchKeys });
  }

}
