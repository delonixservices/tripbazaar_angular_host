import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hotel-room-select',
  templateUrl: './hotel-room-select.component.html',
  styleUrls: ['./hotel-room-select.component.css']
})
export class HotelRoomSelectComponent implements OnInit {

  @Input() hotelPackages;
  @Input() amenities;
  @Input() imageDetails;
  @Input() mobile: boolean;

  // for getting food type from food code, eg: foodCode 1 = Room Only
  public foodType = [
    "",
    "Room Only",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Half Board: Could be any 2 meals (e.g.breakfast and lunch, lunch and dinner",
    "Full Board: Breakfast, lunch and dinner",
    "All Inclusive"
  ];

  constructor() { }

  ngOnInit() {
  }

}
