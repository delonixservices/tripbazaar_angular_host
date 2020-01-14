import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-passenger-select',
  templateUrl: './passenger-select.component.html',
  styleUrls: ['./passenger-select.component.scss']
})
export class PassengerSelectComponent implements OnInit {

  @Input() passengers = {
    adult_count: 1,
    child_count: 0,
    infant_count: 0
  };

  @Output() valueChange = new EventEmitter();

  public adult_count: number = 1;
  public child_count: number = 0;
  public infant_count: number = 0;
  total_passengers: number;

  public passengersObj = {
    adult_count: 1,
    child_count: 0,
    infant_count: 0
  }

  constructor() { }

  ngOnInit() {
    // convert from type string to number
    this.adult_count = +this.passengers.adult_count;
    this.child_count = +this.passengers.child_count;
    this.infant_count = +this.passengers.infant_count;
    this.total_passengers = this.adult_count + this.child_count + this.infant_count;
    console.log(typeof (this.total_passengers));
  }

  adultMinusClicked() {
    if (!this.adult_count) {
      this.adult_count = 1;
    }
    if (this.adult_count > 1) {
      this.adult_count -= 1;
    } else {
      this.adult_count = 1;
    }

    this.passengersObj.adult_count = this.adult_count;
    this.onValueChange();
  }

  adultPlusClicked() {
    if (this.adult_count <= 0) {
      this.adult_count = 1;
    } else {
      this.adult_count += 1;
    }
    this.passengersObj.adult_count = this.adult_count;
    this.onValueChange();
  }

  childMinusClicked() {
    if (this.child_count <= 0) {
      this.child_count = 0;
    } else {
      this.child_count -= 1;
    }
    this.passengersObj.child_count = this.child_count;
    this.onValueChange();
  }

  childPlusClicked() {
    if (this.child_count <= 0) {
      this.child_count = 1;
    } else {
      this.child_count += 1;
    }
    this.passengersObj.child_count = this.child_count;
    this.onValueChange();
  }

  infantMinusClicked() {
    if (this.infant_count <= 0) {
      this.infant_count = 0;
    } else {
      this.infant_count -= 1;
    }
    this.passengersObj.infant_count = this.infant_count;
    this.onValueChange();
  }

  infantPlusClicked() {
    if (this.infant_count <= 0) {
      this.infant_count = 1;
    } else {
      this.infant_count += 1;
    }
    this.passengersObj.infant_count = this.infant_count;
    this.onValueChange();
  }

  onValueChange() {
    this.total_passengers = this.adult_count + this.child_count + this.infant_count;
    console.log(typeof (this.adult_count));
    this.valueChange.emit(this.passengersObj);
  }

}
