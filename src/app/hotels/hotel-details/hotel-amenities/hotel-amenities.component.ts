import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-hotel-amenities',
  templateUrl: './hotel-amenities.component.html',
  styleUrls: ['./hotel-amenities.component.css']
})
export class HotelAmenitiesComponent implements OnInit {

  @Input() amenities;

  constructor() { }

  ngOnInit() { }

}
