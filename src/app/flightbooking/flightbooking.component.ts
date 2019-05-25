import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flightbooking-page',
  templateUrl: './flightbooking.component.html',
  styleUrls: ['./flightbooking.component.css']
})

export class FlightbookingComponent implements OnInit {
  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    
  }
}
