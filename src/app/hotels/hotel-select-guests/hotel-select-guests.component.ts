import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hotel-select-guests',
  templateUrl: './hotel-select-guests.component.html',
  styleUrls: ['./hotel-select-guests.component.css']
})
export class HotelSelectGuestsComponent implements OnInit {



  @Input() guests: number;
  @Input() roomdetail = [{
    "room": "1",
    "adult_count": "1",
    "child_count": "0",
    "children": []
  }];

  @Output() guestsChange = new EventEmitter();
  @Output() roomdetailChange = new EventEmitter();
  @Output() applyClicked = new EventEmitter();

  currentAccordion: number = 0;

  constructor() { }

  ngOnInit() {
  }

  addRoomInSearch(acc: NgbAccordion) {
    this.currentAccordion = this.currentAccordion + 1;
    setTimeout(() => acc.expand(`panel${this.currentAccordion}`), 0);
    this.roomdetail.push({
      "room": '' + ((this.roomdetail.length) + 1),
      "adult_count": "1",
      "child_count": "0",
      "children": []
    });
    this.updateGuests();
    this.roomdetailChange.emit(this.roomdetail);
  }

  removeRoomFromSearch(index) {
    console.log(this.roomdetail.length);
    this.currentAccordion = this.currentAccordion - 1;
    if (this.roomdetail.length > 1) {
      const arr = this.roomdetail.splice(index, 1);
      console.log(arr, index);
    }
    this.updateGuests();
  }

  onApplyClicked() {
    this.updateGuests();
    this.applyClicked.emit();
  }

  updateGuests() {
    let guests = 0;
    this.roomdetail.forEach((room) => {
      guests += Number(room.adult_count) + Number(room.child_count);
    });
    this.guests = guests;
    // console.log('guests =' + this.guests);
    this.guestsChange.emit(guests);
  }

  onAdultChange() {
    this.roomdetailChange.emit(this.roomdetail);
  }

  checkChildren(index) {
    // console.log('room = ' + index);
    // console.log('child_count = ' + Number(this.roomdetail[index].child_count));
    // console.log(this.roomdetail[index]);

    if (this.roomdetail[index].children.length > Number(this.roomdetail[index].child_count)) {
      // this.roomdetail[index].children.splice(-1, this.roomdetail[index].children.length - Number(this.roomdetail[index].child_count));
      this.roomdetail[index].children.splice(Number(this.roomdetail[index].child_count), this.roomdetail[index].children.length + 1);
    } else {
      for (let i = 0; i < Number(this.roomdetail[index].child_count); i++) {
        console.log(this.roomdetail[index].children[i] === undefined);
        if (this.roomdetail[index].children[i] === undefined) {
          this.roomdetail[index].children[i] = { age: "5" };
        }
      }
    }
    // console.log(this.roomdetail[index]);
    this.roomdetailChange.emit(this.roomdetail);
  }

  onChildAgeChange() {
    this.roomdetailChange.emit(this.roomdetail);
  }

}
