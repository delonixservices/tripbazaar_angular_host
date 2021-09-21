import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-item',
  templateUrl: './flight-item.component.html',
  styleUrls: ['./flight-item.component.scss']
})
export class FlightItemComponent implements OnInit {

  @Input() flight;
  @Output() selectedFlight = new EventEmitter();
  @Output() bookFlight = new EventEmitter();

  showFlightDetails: boolean;

  constructor(
    public router: Router
  ) { }

  ngOnInit() {
  }

  onClick() {
    this.showFlightDetails = !this.showFlightDetails;
  }

  handleFlightSelect() {
    this.selectedFlight.emit(this.flight);
  }

  bookClickHandler() {
    this.bookFlight.emit(this.flight);
  }

}
